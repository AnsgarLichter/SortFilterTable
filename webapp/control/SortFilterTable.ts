import Table from "sap/m/Table";
import type { MetadataOptions } from "sap/ui/core/Element";
import OverflowToolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import Title from "sap/m/Title";
import Button from "sap/m/Button";
import ViewSettingsDialog, { ViewSettingsDialog$ConfirmEvent } from "sap/m/ViewSettingsDialog";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import Text from "sap/m/Text";
import Comparator from "../utils/comparator";
import { SortFilterColumnDataType } from "./SortFilterColumnDataType";
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
import Filter from "sap/ui/model/Filter";
import Select, { Select$ChangeEvent } from "sap/m/Select";
import Input from "sap/m/Input";
import { Input$ChangeEvent } from "sap/ui/webc/main/Input";
import { InputBase$ChangeEvent } from "sap/m/InputBase";
import DatePicker from "sap/m/DatePicker";
import Control from "sap/ui/core/Control";
import JSONModel from "sap/ui/model/json/JSONModel";

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
			"columns": { type: "com.lichter.mobilesortfilter.control.SortFilterColumn", multiple: true },
			"_sortDialog": { type: "sap.m.ViewSettingsDialog", multiple: false },
			"_filterDialog": { type: "sap.m.ViewSettingsDialog", multiple: false },
		},
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
		this.getColumns().forEach((column) => {
			switch (column.getDataType()) {
				case SortFilterColumnDataType.Number:
				case SortFilterColumnDataType.Date:
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
		});

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
		this.get_sortDialog().open();
	}

	private createFilterButton(): Button {
		return new Button({
			icon: "sap-icon://filter",
			press: this.onOpenFilterDialogPressed.bind(this)
		});
	}

	private onOpenFilterDialogPressed(): void {
		this.get_filterDialog().open();
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
		this.set_sortDialog(sortDialog);
	}

	private onConfirmSortPressed(event: ViewSettingsDialog$ConfirmEvent): void {
		const itemsBinding = this.getBinding("items") as ListBinding;
		const sortDescending = event.getParameter("sortDescending");
		const sortItem = event.getParameter("sortItem");
		if (!itemsBinding || !sortItem) {
			return;
		}

		const column = Element.getElementById(sortItem.getKey()) as SortFilterColumn;
		let comparatorFunction;
		switch (column.getDataType()) {
			case SortFilterColumnDataType.Number:
				comparatorFunction = Comparator.compareNumbers;
				break;
			case SortFilterColumnDataType.Date:
				comparatorFunction = Comparator.compareDateStrings;
				break;
			default:
				comparatorFunction = Comparator.compareStrings;
				break;
		}

		itemsBinding.sort(new Sorter(
			column.getTargetProperty(),
			sortDescending,
			false,
			comparatorFunction
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

		this.set_filterDialog(new ViewSettingsDialog({
			confirm: this.onConfirmFiltersPressed.bind(this),
			reset: this.onResetFiltersPressed.bind(this),
			filterItems: filterItems
		}));
	}

	private createFilterControl(column: SortFilterColumn): Control {
		//TODO: Add property FilterType to Column and add a Type "Select"
		switch (column.getDataType()) {
			case SortFilterColumnDataType.Number:
				return this.createNumberFilterControl(column);
			case SortFilterColumnDataType.Date:
				return this.createDateFilterControl(column);
			default:
				return this.createTextFilterControl(column);
		}
	}

	private createTextFilterControl(column: SortFilterColumn): SimpleForm {
		return new SimpleForm({
			content: [
				new Label({ text: "Filter Operator" }),
				new Select({
					items: [
						new Item({ key: FilterOperator.EQ, text: "Contains" }),
						new Item({ key: FilterOperator.Contains, text: "Equals" }),
					],
					selectedKey: `{${this.getId()}>/${column.getId()}/filterOperator}`,
				}),

				new Label({ text: "Filter Value" }),
				new Input({
					change: this.onStringFilterValueChanged.bind(this),
					value: {
						path: `${this.getId()}>/${column.getId()}/filterValue}`,
						type: column.getFilterPropertyBindingType(),
						formatOptions: column.getFilterPropertyBindingFormatOptions()
					}
				})
			]
		});
	}

	private onStringFilterValueChanged(event: InputBase$ChangeEvent): void {
		throw new Error("Method not implemented.");
	}

	private createDateFilterControl(column: SortFilterColumn): SimpleForm {
		//TODO: Determine the date format from the binding
		// Template not available
		// Binding can only be accessed via first item and name of aggregations 
		// (cells, ...) can differ based on the used subclass of sap.m.ListBase.
		// Afterwards the determination of the bound property is not very nice to retrieve.
		// Therefore only a binding to the custom column helps but can be optional.

		return new SimpleForm({
			content: [
				new Label({ text: "Filter Operator" }),
				new Select({
					items: [
						new Item({ key: FilterOperator.BT, text: "Between" }),
						new Item({ key: FilterOperator.EQ, text: "Equals" }),
						new Item({ key: FilterOperator.GT, text: "Greater Than" }),
						new Item({ key: FilterOperator.GE, text: "Greater or Equals" }),
						new Item({ key: FilterOperator.LE, text: "Less or Equals" }),
						new Item({ key: FilterOperator.LT, text: "Less than" }),
						new Item({ key: FilterOperator.NE, text: "Not Equals" }),
					],
					selectedKey: `{${this.getId()}>/${column.getId()}/filterOperator}`,
					change: this.onDateFilterOperatorChanged.bind(this)
				}),

				new Label({ text: "Begin Date" }),
				new DatePicker({
					value: {
						path: `${this.getId()}>/${column.getId()}/filterValue}`,
						type: column.getFilterPropertyBindingType(),
						formatOptions: column.getFilterPropertyBindingFormatOptions()
					},
					change: this.onDateFilterValueChanged.bind(this)
				}),
				
				new Label({
					visible: `{= \${${this.getId()}>/${column.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
					text: "End Date"
				}),
				new DatePicker({
					visible: `{= \${${this.getId()}>/${column.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
					value: {
						path: `${this.getId()}>/${column.getId()}/filterValue2}`,
						type: column.getFilterPropertyBindingType(),
						formatOptions: column.getFilterPropertyBindingFormatOptions()
					},
					change: this.onDateFilterValueChanged.bind(this)
				})
			]
		});
	}

	private onDateFilterOperatorChanged(event: Select$ChangeEvent): void {
		throw new Error("Method not implemented.");
	}

	private onDateFilterValueChanged(event: InputBase$ChangeEvent): void {
		throw new Error("Method not implemented.");
	}

	private createNumberFilterControl(column: SortFilterColumn): SimpleForm {
		return new SimpleForm({
			content: [
				new Label({ text: "Filter Operator" }),
				new Select({
					items: [
						new Item({ key: FilterOperator.BT, text: "Between" }),
						new Item({ key: FilterOperator.EQ, text: "Equals" }),
						new Item({ key: FilterOperator.GT, text: "Greater Than" }),
						new Item({ key: FilterOperator.GE, text: "Greater or Equals" }),
						new Item({ key: FilterOperator.LE, text: "Less or Equals" }),
						new Item({ key: FilterOperator.LT, text: "Less than" }),
						new Item({ key: FilterOperator.NE, text: "Not Equals" }),
					],
					change: this.onNumberFilterOperatorChanged.bind(this),
					selectedKey: `{${this.getId()}>/${column.getId()}/filterOperator}`
				}),

				new Label({ text: "Value 1" }),
				new Input({
					type: 'Number',
					value: {
						path: `${this.getId()}>/${column.getId()}/filterValue}`,
						type: column.getFilterPropertyBindingType(),
						formatOptions: column.getFilterPropertyBindingFormatOptions()
					},
					change: this.onNumberFilterValueChanged.bind(this)
				}),

				new Label({
					visible: `{= \${${this.getId()}/${column.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
					text: "Value 2"
				}),
				new Input({
					visible: `{= \${${this.getId()}>/${column.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
					type: 'Number',
					value: {
						path: `${this.getId()}>/${column.getId()}/filterValue2}`,
						type: column.getFilterPropertyBindingType(),
						formatOptions: column.getFilterPropertyBindingFormatOptions()
					},
					change: this.onNumberFilterValueChanged.bind(this)
				}),
			]
		});
	}

	private onNumberFilterOperatorChanged(event: Select$ChangeEvent): void {
		throw new Error("Method not implemented.");
	}

	private onNumberFilterValueChanged(event: InputBase$ChangeEvent): void {
		throw new Error("Method not implemented.");
	}

	private onConfirmFiltersPressed(event: ViewSettingsDialog$ConfirmEvent): void {
		throw new Error("Method not implemented.");
	}

	private onResetFiltersPressed(): void {
		throw new Error("Method not implemented.");
	}


	/** Must be overriden because the interface generator defines another type which 
	 * leads to TypeScript errors - see: https://github.com/SAP/ui5-typescript/issues/470
	 */
	removeColumn(vColumn: int | string | SortFilterColumn): SortFilterColumn | null {
		return super.removeColumn(vColumn as Column) as SortFilterColumn;
	}
}