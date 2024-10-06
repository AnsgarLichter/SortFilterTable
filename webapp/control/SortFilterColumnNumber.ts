import { InputBase$ChangeEvent } from "sap/m/InputBase";
import Label from "sap/m/Label";
import Select, { Select$ChangeEvent } from "sap/m/Select";
import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Item from "sap/ui/core/Item";
import FilterOperator from "sap/ui/model/FilterOperator";
import SortFilterColumn from "./SortFilterColumn";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import SortFilterTable from "./SortFilterTable";
import Control from "sap/ui/core/Control";
import Input from "sap/m/Input";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumnNumber extends SortFilterColumn {
 
	static readonly metadata: MetadataOptions = {
		properties: {},
        aggregations: {}
	};

	getFilterItem(): Control {
        const table = this.getParent() as SortFilterTable;

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
                    selectedKey: `{${this.getId()}>/${this.getId()}/filterOperator}`
                }),

                new Label({ text: "Value 1" }),
                new Input({
                    type: 'Number',
                    value: {
                        // TODO: How to bind to expected model?
                        path: `${this.getId()}>/${this.getId()}/filterValue`,
                        type: this.getPropertyBindingType(),
                        formatOptions: this.getPropertyBindingFormatOptions()
                    },
                    change: this.onNumberFilterValueChanged.bind(this)
                }),

                new Label({
                    // TODO: How to bind to expected model?
                    visible: `{= \${${this.getId()}/${this.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
                    text: "Value 2"
                }),
                new Input({
                    // TODO: How to bind to expected model?
                    visible: `{= \${${this.getId()}>/${this.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
                    type: 'Number',
                    value: {
                        // TODO: How to bind to expected model?
                        path: `${this.getId()}>/${this.getId()}/filterValue2`,
                        type: this.getPropertyBindingType(),
                        formatOptions: this.getPropertyBindingFormatOptions()
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
}