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

/**
 * @namespace com.lichter.mobilesortfilter.control
 */

//ts-ignore
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
			this.initializeToolbar();
			this.initializeSortDialog();
			this.initializeFilterDialog();

			this.initialRenderingDone = true;
		}
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
			confirm: this.onSortConfirmed.bind(this),
			sortItems: sortItems
		});
		this.set_sortDialog(sortDialog);
	}

	private onSortConfirmed(event: ViewSettingsDialog$ConfirmEvent): void {
		const itemsBinding = this.getBinding("items") as ListBinding;
		const sortDescending = event.getParameter("sortDescending");
		const sortItem = event.getParameter("sortItem");
		if(!itemsBinding || !sortItem) {
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
            column.getSortProperty(),
            sortDescending,
            false,
            comparatorFunction
        ));
	}

	private initializeFilterDialog() {
		if (!this.getCreateFilterDialog()) {
			return;
		}

		//TODO: Implement creation of filter dialog
	}

	/** Must be overriden because the interface generator defines another type which 
	 * leads to TypeScript errors - see: https://github.com/SAP/ui5-typescript/issues/470
	 */
	removeColumn(vColumn: int | string | SortFilterColumn): SortFilterColumn | null {
		return super.removeColumn(vColumn as Column) as SortFilterColumn;
	}
}