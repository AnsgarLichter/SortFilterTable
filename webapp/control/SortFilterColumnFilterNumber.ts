import type { MetadataOptions } from "sap/ui/core/Element";
import type { SortFilterColumnFilterType } from "./SortFilterColumnFilterType";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Label from "sap/m/Label";
import Input from "sap/m/Input";
import Select, { Select$ChangeEvent } from "sap/m/Select";
import Item from "sap/ui/core/Item";
import FilterOperator from "sap/ui/model/FilterOperator";
import SortFilterColumn from "./SortFilterColumn";
import { InputBase$ChangeEvent } from "sap/m/InputBase";
import SortFilterColumnFilter from "./SortFilterColumnFilter";
import { form } from "sap/ui/layout/library";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumnFilterNumber extends SortFilterColumnFilter {

    static readonly metadata: MetadataOptions = {
		properties: {},
        aggregations: {}
	};
    
    // TODO: Implement in render manager and reuse this implementation
    static renderer = {
        apiVersion: 2,
        render: function (rm: RenderManager, control: SortFilterColumnFilter): void {
            rm.openStart("div", control);
            rm.openEnd();

            rm.renderControl(control.getAggregation("_form") as SimpleForm);

            rm.close("div");
        }
    };

    protected createFilterForm() {
        const column = this.getParent() as SortFilterColumn;
        const form = new SimpleForm({
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
                        // TODO: How to bind to expected model?
                        path: `${this.getId()}>/${column.getId()}/filterValue`,
                        type: this.getPropertyBindingType(),
                        formatOptions: this.getPropertyBindingFormatOptions()
                    },
                    change: this.onNumberFilterValueChanged.bind(this)
                }),

                new Label({
                    // TODO: How to bind to expected model?
                    visible: `{= \${${this.getId()}/${column.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
                    text: "Value 2"
                }),
                new Input({
                    // TODO: How to bind to expected model?
                    visible: `{= \${${this.getId()}>/${column.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
                    type: 'Number',
                    value: {
                        // TODO: How to bind to expected model?
                        path: `${this.getId()}>/${column.getId()}/filterValue2`,
                        type: this.getPropertyBindingType(),
                        formatOptions: this.getPropertyBindingFormatOptions()
                    },
                    change: this.onNumberFilterValueChanged.bind(this)
                }),
            ]
        });

        this.setAggregation("_form", form);
    }

    private onNumberFilterOperatorChanged(event: Select$ChangeEvent): void {
        throw new Error("Method not implemented.");
    }

    private onNumberFilterValueChanged(event: InputBase$ChangeEvent): void {
        throw new Error("Method not implemented.");
    }
}