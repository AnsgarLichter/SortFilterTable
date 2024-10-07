import { InputBase$ChangeEvent } from "sap/m/InputBase";
import Label from "sap/m/Label";
import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Item from "sap/ui/core/Item";
import SortFilterColumn from "./SortFilterColumn";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import SortFilterTable from "./SortFilterTable";
import Control from "sap/ui/core/Control";
import MultiComboBox, { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumnNumber extends SortFilterColumn {
 
	static readonly metadata: MetadataOptions = {
		properties: {
            "masterdataItemsBinding": { type: "string", defaultValue: null },
            "masterdataKeyBinding": { type: "string", defaultValue: null },
            "masterdataTextBinding": { type: "string", defaultValue: null }
        },
        aggregations: {}
	};

	public getDefaultFilterSettings(): object {
        return {
            selectedKeys: [],
            filterCount: 0,
            isSelected: false
        };
    }

	public getFilterItem(): Control {
        const table = this.getParent() as SortFilterTable;

        return new SimpleForm({
			content: [
				new Label({ text: "Filter Items" }),
				new MultiComboBox({
					items: {
						path: `${this.getMasterdataItemsBinding()}`,
						template: new Item({
							key: `{${this.getMasterdataKeyBinding()}}`,
							text: `{${this.getMasterdataTextBinding()}}`
						})
					},
					selectedKeys: `{${this.getId()}>/${this.getId()}/selectedKeys}`,
					selectionFinish: this.onItemsSelectionFinished.bind(this),
				}),
			]
		});
    }

    private onItemsSelectionFinished(event: MultiComboBox$SelectionFinishEvent): void {
		this.updateSelectedKeys(event);
		this.updateFilterStatus(event);
    }

	private updateSelectedKeys(event: MultiComboBox$SelectionFinishEvent) {
		const tableSettingsModel = this.getTableSettingsModel();
		const selectedItems = event.getParameter("selectedItems");
		const selectedKeys = selectedItems?.map((item: Item) => item.getKey()) || [];

		tableSettingsModel.setProperty(`/${this.getId()}/selectedKeys`, selectedKeys);
	}

	private updateFilterStatus(event: MultiComboBox$SelectionFinishEvent) {
		const tableSettingsModel = this.getTableSettingsModel();
		const selectedItems = event.getParameter("selectedItems");
		const isSelected = selectedItems && selectedItems.length > 0;

		tableSettingsModel.setProperty(`/${this.getId()}/isSelected`, isSelected);
		tableSettingsModel.setProperty(`/${this.getId()}/filterCount`, isSelected ? 1 : 0);
	}

	private getTableSettingsModel() {
		const parentId = this.getParent()!.getId();
		return this.getModel(parentId) as JSONModel;
	}
}