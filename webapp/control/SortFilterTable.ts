import Table from "sap/m/Table";
import type { MetadataOptions } from "sap/ui/core/Element";
import OverflowToolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import Title from "sap/m/Title";
import Button from "sap/m/Button";
import ViewSettingsDialog, { ViewSettingsDialog$ConfirmEvent } from "sap/m/ViewSettingsDialog";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import Text from "sap/m/Text";
import { SortFilterColumnFilterType } from "./SortFilterColumnFilterType";
import Sorter from "sap/ui/model/Sorter";
import ListBinding from "sap/ui/model/ListBinding";
import SortFilterColumn from "./SortFilterColumn";
import Element from "sap/ui/core/Element";
import Column from "sap/m/Column";
import ViewSettingsCustomItem from "sap/m/ViewSettingsCustomItem";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Label from "sap/m/Label";
import Item from "sap/ui/core/Item";
import FilterOperator from "sap/ui/model/FilterOperator";
import Select, { Select$ChangeEvent } from "sap/m/Select";
import Input from "sap/m/Input";
import { InputBase$ChangeEvent } from "sap/m/InputBase";
import DatePicker from "sap/m/DatePicker";
import Control from "sap/ui/core/Control";
import JSONModel from "sap/ui/model/json/JSONModel";
import MultiComboBox, { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import Log from "sap/base/Log";
import SortFilterColumnFilterSelect from "./SortFilterColumnFilterSelect";
import SortFilterColumnFilter from "./SortFilterColumnFilter";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterTable extends Table {

	constructor(idOrSettings?: string | $SortFilterTableSettings);
	constructor(id?: string, settings?: $SortFilterTableSettings);
	constructor(id?: string, settings?: $SortFilterTableSettings) { super(id, settings); }

	static readonly metadata: MetadataOptions = {
		properties: {
			"title": { type: "string", defaultValue: "" },
			"createSortDialog": { type: "boolean", defaultValue: true },
			"createFilterDialog": { type: "boolean", defaultValue: true }
		},
		aggregations: {
			"columns": {
				type: "com.lichter.mobilesortfilter.control.SortFilterColumn",
				multiple: true
			},
			"_sortDialog": {
				type: "sap.m.ViewSettingsDialog",
				multiple: false,
				visibility: "hidden"
			},
			"_filterDialog": {
				type: "sap.m.ViewSettingsDialog",
				multiple: false,
				visibility: "hidden"
			},
		}
	};

	static renderer = "sap.m.TableRenderer";

	private initialRenderingDone = false;

	onBeforeRendering(): void {
		if (!this.initialRenderingDone) {
			this.initializeModel();
			this.initializeToolbar();
			this.initializeSortDialog();
			this.initializeFilterDialog();

			this.initialRenderingDone = true;
		}
	}

	private initializeModel() {
		if (!this.getCreateFilterDialog()) {
			return;
		}

		const data: { [key: string]: object } = {};
		//TODO: Create model based on type of filter aggregation of column

		/* this.getColumns().forEach((column) => {
			const filter = column.getFilter();
			if (!filter) {
				Log.error(`A filter must be defined for the column ${column.getId()} to be filterable.`);
			}
			// TODO: At runtime filter is just an object? I think the type definition is wrong
			switch (filter.getType()) {
				case SortFilterColumnFilterType.Number:
				case SortFilterColumnFilterType.Date:
					data[column.getId()] = {
						filterOperator: FilterOperator.BT,
						filterValue: "",
						filterValue2: "",
						filterCount: 0,
						isSelected: false
					};
					break;
				default:
					data[column.getId()] = {
						filterOperator: FilterOperator.Contains,
						filterValue: "",
						filterCount: 0,
						isSelected: false
					};
					break;
			}
		}); */

		this.setModel(new JSONModel(data), this.getId());
	}

	private initializeToolbar(): void {
		const headerToolbar = this.getHeaderToolbar();
		if (!headerToolbar) {
			this.setHeaderToolbar(this.createToolbar());
			return;
		}

		headerToolbar.addContent(new ToolbarSpacer());
		if (this.getCreateSortDialog()) {
			headerToolbar.addContent(this.createSortButton());
		}
		if (this.getCreateFilterDialog()) {
			headerToolbar.addContent(this.createFilterButton());
		}
	}

	private createToolbar(): OverflowToolbar {
		const headerToolbar = new OverflowToolbar();

		if (this.getTitle()) {
			headerToolbar.addContent(new Title({
				text: this.getTitle()
			}));
		}

		headerToolbar.addContent(new ToolbarSpacer());
		headerToolbar.addContent(this.createSortButton());
		headerToolbar.addContent(this.createFilterButton());

		return headerToolbar;
	}

	private createSortButton(): Button {
		return new Button({
			icon: "sap-icon://sort",
			press: this.onOpenSortDialogPressed.bind(this)
		});
	}

	private onOpenSortDialogPressed(): void {
		this.getSortDialog().open();
	}

	private createFilterButton(): Button {
		return new Button({
			icon: "sap-icon://filter",
			press: this.onOpenFilterDialogPressed.bind(this)
		});
	}

	private onOpenFilterDialogPressed(): void {
		this.getFilterDialog().open();
	}

	private initializeSortDialog() {
		if (!this.getCreateSortDialog()) {
			return;
		}

		const columns = this.getColumns();
		const sortItems = columns.map((column) => {
			// TODO: What TODO if it is not a text header?
			const header = column.getHeader() as Text;
			return new ViewSettingsItem({
				key: column.getId(),
				text: header.getText()
			});
		});

		const sortDialog = new ViewSettingsDialog({
			confirm: this.onConfirmSortPressed.bind(this),
			sortItems: sortItems
		});
		this.setAggregation("_sortDialog", sortDialog);
	}

	private onConfirmSortPressed(event: ViewSettingsDialog$ConfirmEvent): void {
		const itemsBinding = this.getBinding("items") as ListBinding;
		const sortDescending = event.getParameter("sortDescending");
		const sortItem = event.getParameter("sortItem");
		if (!itemsBinding || !sortItem) {
			return;
		}

		const column = Element.getElementById(sortItem.getKey()) as SortFilterColumn;
		itemsBinding.sort(new Sorter(
			column.getTargetProperty(),
			sortDescending,
			false,
			column.getSortComparator()
		));
	}

	private initializeFilterDialog() {
		if (!this.getCreateFilterDialog()) {
			return;
		}

		const columns = this.getColumns();
		const filterItems = columns.map((column) => {
			const header = column.getHeader() as Text;
			return new ViewSettingsCustomItem({
				key: column.getId(),
				text: header.getText(),
				filterCount: `{${this.getId()}/${column.getId()}/filterCount}`,
				selected: `{${this.getId()}/${column.getId()}/isSelected}`,
				customControl: this.createFilterControl(column)
			});
		});

		this.setAggregation(
			"_filterDialog",
			new ViewSettingsDialog({
				confirm: this.onConfirmFiltersPressed.bind(this),
				reset: this.onResetFiltersPressed.bind(this),
				filterItems: filterItems
			}));
	}

	private createFilterControl(column: SortFilterColumn): Control {
		return column.getFilterItem() as Control;
	}

	/*private createSelectFilterControl(column: SortFilterColumn): SimpleForm {
		const filter = column.getFilter() as SortFilterColumnFilterSelect;

		return new SimpleForm({
			content: [
				new Label({ text: "Filter Operator" }),
				new MultiComboBox({
					items: {
						path: `{${filter.getMasterdataItemsBinding()}}`,
						template: new Item({
							key: `{${filter.getMasterdataKey()}}`,
							text: `{${filter.getMasterdataText()}}`
						})
					},
					selectedKeys: `{${this.getId()}>/${column.getId()}/selectedKeys}`,
					selectionFinish: this.onSelectFilterOperatorSelectionFinished.bind(this),
				}),
			]
		});
	} */

	private onSelectFilterOperatorSelectionFinished(event: MultiComboBox$SelectionFinishEvent): void {
		throw new Error("Method not implemented.");
	}

	private onConfirmFiltersPressed(event: ViewSettingsDialog$ConfirmEvent): void {
		throw new Error("Method not implemented.");
	}

	private onResetFiltersPressed(): void {
		throw new Error("Method not implemented.");
	}

	private getSortDialog(): ViewSettingsDialog {
		return this.getAggregation("_sortDialog") as ViewSettingsDialog;
	}

	private getFilterDialog(): ViewSettingsDialog {
		return this.getAggregation("_filterDialog") as ViewSettingsDialog;
	}


	/** Must be overriden because the interface generator defines another type which 
	 * leads to TypeScript errors - see: https://github.com/SAP/ui5-typescript/issues/470
	 */
	removeColumn(vColumn: int | string | SortFilterColumn): SortFilterColumn | null {
		return super.removeColumn(vColumn as Column) as SortFilterColumn;
	}
}