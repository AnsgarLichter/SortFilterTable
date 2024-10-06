import { InputBase$ChangeEvent } from "sap/m/InputBase";
import Label from "sap/m/Label";
import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Item from "sap/ui/core/Item";
import SortFilterColumn from "./SortFilterColumn";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import SortFilterTable from "./SortFilterTable";
import Control from "sap/ui/core/Control";
import MultiComboBox, { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";

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

	getFilterItem(): Control {
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
					selectionFinish: this.onSelectFilterOperatorSelectionFinished.bind(this),
				}),
			]
		});
    }

    private onSelectFilterOperatorSelectionFinished(event: MultiComboBox$SelectionFinishEvent): void {
        throw new Error("Method not implemented.");
    }

    private onNumberFilterValueChanged(event: InputBase$ChangeEvent): void {
        throw new Error("Method not implemented.");
    }
}