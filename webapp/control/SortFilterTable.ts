import Table from "sap/m/Table";
import type { MetadataOptions } from "sap/ui/core/Element";
import OverflowToolbar from "sap/m/OverflowToolbar";
import Toolbar from "sap/m/Toolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import Title from "sap/m/Title";
import Button from "sap/m/Button";
import ViewSettingsDialog from "sap/m/ViewSettingsDialog";
import View from "sap/ui/vk/View";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import Text from "sap/m/Text";

/**
 * @namespace com.lichter.mobilesortfilter.control.SortFilterTable
 */
export default class SortFilterTable extends Table {

	constructor(idOrSettings?: string | $SortFilterTableSettings);
	constructor(id?: string, settings?: $SortFilterTableSettings);
	constructor(id?: string, settings?: $SortFilterTableSettings) { super(id, settings); }

	static readonly metadata: MetadataOptions = {
		properties: {
			"title": { type: "string", defaultValue: "" },
			"createSortDialog": { type: "boolean", defaultValue: true },
			"createFilterDialog": { type: "boolean", defaultValue: true },
		},
		aggregations: {
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
		const headerToolbar = this.getAggregation("headerToolbar") as Toolbar;
		if (!headerToolbar) {
			this.setAggregation("headerToolbar", this.createToolbar());
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
		throw new Error("Method not implemented");
	}

	private initializeSortDialog() {
		if (!this.getCreateSortDialog()) {
			return;
		}

		const sortItems = this.getColumns().map((column) => {
			const header = column.getHeader() as Text;
			return new ViewSettingsItem({
				key: header.getText(),
				text: header.getText()
			});
		});

		//TODO: Validate whether reset is working
		const sortDialog = new ViewSettingsDialog({
			confirm: this.onSortDialogConfirmed,
			sortItems: sortItems
		});
		this.setAggregation("_sortDialog", sortDialog);
	}

	private onSortDialogConfirmed(): void {
		throw new Error("Method not implemented");
	}

	private initializeFilterDialog() {
		if (!this.getCreateFilterDialog()) {
			return;
		}
	}

}