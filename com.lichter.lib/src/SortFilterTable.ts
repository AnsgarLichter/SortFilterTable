import Table from "sap/m/Table";
import type { MetadataOptions } from "sap/ui/core/Element";
import OverflowToolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import Title from "sap/m/Title";
import Button from "sap/m/Button";
import ViewSettingsDialog, { ViewSettingsDialog$ConfirmEvent } from "sap/m/ViewSettingsDialog";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import Text from "sap/m/Text";
import Sorter from "sap/ui/model/Sorter";
import ListBinding from "sap/ui/model/ListBinding";
import SortFilterColumn from "./SortFilterColumn";
import Element from "sap/ui/core/Element";
import ViewSettingsCustomItem from "sap/m/ViewSettingsCustomItem";
import JSONModel from "sap/ui/model/json/JSONModel";
import Log from "sap/base/Log";
import Filter from "sap/ui/model/Filter";
import Toolbar from "sap/m/Toolbar";
import Lib from "sap/ui/core/Lib";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @name com.lichter.lib.SortFilterTable
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
				type: "com.lichter.lib.SortFilterColumn",
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
		if (this.initialRenderingDone) {
			return;
		}

		this.initializeModel();
		this.initializeToolbar();
		this.initializeSortDialog();
		this.initializeFilterDialog();

		this.initialRenderingDone = true;
	}

	private initializeModel() {
		if (!this.getCreateFilterDialog()) {
			return;
		}

		const data: { [key: string]: object } = {};
		this.getColumns().forEach((column: SortFilterColumn) => {
			data[column.getId()] = column.getDefaultFilterSettings();
		});
		this.setModel(new JSONModel(data), this.getId());
	}

	private initializeToolbar(): void {
		const headerToolbar = this.getHeaderToolbar();
		if (!headerToolbar) {
			this.setHeaderToolbar(this.createToolbar());
			return;
		}

		this.addHeaderContent(headerToolbar);
	}

	private createToolbar(): OverflowToolbar {
		const headerToolbar = new OverflowToolbar();

		if (this.getTitle()) {
			headerToolbar.addContent(new Title({
				text: this.getTitle()
			}));
		}

		this.addHeaderContent(headerToolbar);
		return headerToolbar;
	}

	private addHeaderContent(headerToolbar: Toolbar) {
		headerToolbar.addContent(new ToolbarSpacer());
		if (this.getCreateSortDialog()) {
			headerToolbar.addContent(this.createSortButton());
		}
		if (this.getCreateFilterDialog()) {
			headerToolbar.addContent(this.createFilterButton());
		}
	}

	private createSortButton(): Button {
		return new Button({
			icon: this.getResourceBundle().getText("lichter.mobilesortfilter.sort.icon"),
			press: this.onOpenSortDialogPressed.bind(this)
		});
	}

	private onOpenSortDialogPressed(): void {
		this.getSortDialog().open();
	}

	private createFilterButton(): Button {
		return new Button({
			icon: this.getResourceBundle().getText("lichter.mobilesortfilter.filter.icon"),
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

		this.setSortDialog(this.createSortDialog());
	}

	private createSortDialog() {
		const sortDialog = new ViewSettingsDialog({
			confirm: this.onConfirmSortPressed.bind(this),
			sortItems: this.createSortItems()
		});
		return sortDialog;
	}

	private createSortItems() {
		const columns = this.getColumns();
		const sortItems = columns.map((column: SortFilterColumn) => {
			const header = column.getHeader() as Text;
			return new ViewSettingsItem({
				key: column.getId(),
				text: header.getText()
			});
		});

		return sortItems;
	}

	private onConfirmSortPressed(event: ViewSettingsDialog$ConfirmEvent): void {
		const itemsBinding = this.getBinding("items") as ListBinding;
		const sortDescending = event.getParameter("sortDescending");
		const sortItem = event.getParameter("sortItem");
		if (!itemsBinding || !sortItem) {
			Log.warning("No items binding or sort item found. Sorting cannot be applied!");
			return;
		}

		const column = Element.getElementById(sortItem.getKey()) as SortFilterColumn;
		itemsBinding.sort(
			new Sorter(
				column.getTargetProperty(),
				sortDescending,
				false,
				column.getSortComparator()
			)
		);
	}

	private initializeFilterDialog() {
		if (!this.getCreateFilterDialog()) {
			return;
		}

		const columns = this.getColumns();
		const filterItems = columns.map((column: SortFilterColumn) => {
			const header = column.getHeader() as Text;
			return new ViewSettingsCustomItem({
				key: column.getId(),
				text: header.getText(),
				filterCount: `{${this.getId()}>/${column.getId()}/filterCount}`,
				selected: `{${this.getId()}>/${column.getId()}/isSelected}`,
				customControl: column.getFilterForm()
			});
		});

		this.setFilterDialog(
			new ViewSettingsDialog({
				confirm: this.onConfirmFiltersPressed.bind(this),
				reset: this.onResetFiltersPressed.bind(this),
				filterItems: filterItems
			})
		);
	}

	private onConfirmFiltersPressed(event: ViewSettingsDialog$ConfirmEvent): void {
		const filterItems = event.getParameter("filterItems");
		if (!filterItems) {
			Log.warning("No filter items found. No filters will be applied!");
			return;
		}

		this.applyFilters(filterItems);
	}

	private applyFilters(filterItems: ViewSettingsItem[]) {
		const columns = this.getColumns();
		const filters: Filter[] = [];

		this.buildFiltersFromItems(filterItems, columns, filters);

		const itemsBinding = this.getBinding("items") as ListBinding;
		itemsBinding.filter(filters);
	}

	private buildFiltersFromItems(filterItems: ViewSettingsItem[], columns: SortFilterColumn[], filters: Filter[]) {
		filterItems.forEach((filterItem) => {
			const filterKey = filterItem.getKey();
			const column = columns.find((column) => column.getId() === filterKey);
			if (!column) {
				const message = `Column with ID ${filterKey} to apply filter to not found`;
				Log.error(message);
				throw new Error(message);
			}

			filters.push(column.getFilterItem());
		});
	}

	private onResetFiltersPressed(): void {
		this.initializeModel();
	}

	private getSortDialog(): ViewSettingsDialog {
		return this.getAggregation("_sortDialog") as ViewSettingsDialog;
	}

	private getFilterDialog(): ViewSettingsDialog {
		return this.getAggregation("_filterDialog") as ViewSettingsDialog;
	}

	private setSortDialog(sortDialog: ViewSettingsDialog): void {
		this.setAggregation("_sortDialog", sortDialog);
	}

	private setFilterDialog(filterDialog: ViewSettingsDialog): void {
		this.setAggregation("_filterDialog", filterDialog);
	}

	private getResourceBundle(): ResourceBundle {
		return Lib.getResourceBundleFor("com.lichter.lib");
	}
}