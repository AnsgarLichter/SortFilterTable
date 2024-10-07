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
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumnNumber extends SortFilterColumn {

    static readonly metadata: MetadataOptions = {
        properties: {},
        aggregations: {}
    };

    public getDefaultFilterSettings(): object {
        return {
            filterOperator: FilterOperator.BT,
            filterValue: "",
            filterValue2: "",
            filterCount: 0,
            isSelected: false
        };
    }

    public getFilterItem(): Control {
        const parentId = this.getParent()!.getId();

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
                    selectedKey: `{${parentId}>/${this.getId()}/filterOperator}`
                }),

                new Label({ text: "Value 1" }),
                new Input({
                    type: 'Number',
                    value: {
                        path: `${parentId}>/${this.getId()}/filterValue`,
                        type: this.getPropertyBindingType(),
                        formatOptions: this.getPropertyBindingFormatOptions()
                    },
                    change: this.onNumberFilterValueChanged.bind(this)
                }),

                new Label({
                    visible: `{= \${${parentId}>/${this.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
                    text: "Value 2"
                }),
                new Input({
                    visible: `{= \${${parentId}>/${this.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
                    type: 'Number',
                    value: {
                        path: `${parentId}>/${this.getId()}/filterValue2`,
                        type: this.getPropertyBindingType(),
                        formatOptions: this.getPropertyBindingFormatOptions()
                    },
                    change: this.onNumberFilterValueChanged.bind(this)
                }),
            ]
        });
    }

    private onNumberFilterOperatorChanged(): void {
        this.clearFilterValue2();
        this.updateFilterStatus(); 
    }

    private onNumberFilterValueChanged(event: InputBase$ChangeEvent): void {
        this.updateFilterStatus();
    }

    private clearFilterValue2() {
        const id = this.getId();
        const parentId = this.getParent()!.getId();
        const tableSettingsModel = this.getModel(parentId) as JSONModel;

        const filterOperator = tableSettingsModel.getProperty(`/${id}/filterOperator`) as string;
        if (filterOperator !== FilterOperator.BT) {
            tableSettingsModel.setProperty(`/${id}/filterValue2`, "");
        }
    }

    private updateFilterStatus() {
        const id = this.getId();
        const parentId = this.getParent()!.getId();
        const tableSettingsModel = this.getModel(parentId) as JSONModel;

        const filterOperator = tableSettingsModel.getProperty(`/${id}/filterOperator`) as string;
        const value1 = tableSettingsModel.getProperty(`/${id}/filterValue`) as string;
        const value2 = tableSettingsModel.getProperty(`/${id}/filterValue2`) as string;

        let isSelected = value1 !== null && value1 !== "";
        if (filterOperator === FilterOperator.BT) {
            isSelected = isSelected && value2 !== null && value2 !== "";
        }

        tableSettingsModel.setProperty(`/${id}/isSelected`, isSelected);
        tableSettingsModel.setProperty(`/${id}/filterCount`, isSelected ? 1 : 0);
    }
}