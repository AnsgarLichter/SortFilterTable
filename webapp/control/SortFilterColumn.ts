import Column from "sap/m/Column";
import { MetadataOptions } from "sap/ui/core/Element";
import Control from "sap/ui/core/Control";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import Select from "sap/m/Select";
import Item from "sap/ui/core/Item";
import FilterOperator from "sap/ui/model/FilterOperator";
import { InputBase$ChangeEvent } from "sap/m/InputBase";
import SortFilterTable from "./SortFilterTable";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumn extends Column {

    constructor(idOrSettings?: string | $SortFilterColumnSettings);
    constructor(id?: string, settings?: $SortFilterColumnSettings);
    constructor(id?: string, settings?: $SortFilterColumnSettings) { super(id, settings); }
    //TODO: How to define this as interface? If possible, transform this to SortFilterColumnString
    static readonly metadata: MetadataOptions = {
        properties: {
            "targetProperty": { type: "string", defaultValue: "" },
            "sortComparator": { type: "function", defaultValue: null },
            "propertyBindingType": { type: "sap.ui.model.Type", defaultValue: null },
            "propertyBindingFormatOptions": { type: "object", defaultValue: null },
        }
    };

    static renderer = "sap.m.ColumnRenderer";

    public getDefaultFilterSettings(): object {
        return {
            filterOperator: FilterOperator.Contains,
            filterValue: "",
            filterCount: 0,
            isSelected: false
        };
    }

    public getFilterItem(): Control {
        const table = this.getParent() as SortFilterTable;

        return new SimpleForm({
			content: [
				new Label({ text: "Filter Operator" }),
				new Select({
					items: [
						new Item({ key: FilterOperator.EQ, text: "Equals" }),
						new Item({ key: FilterOperator.Contains, text: "Contains" }),
					],
					selectedKey: `{${table.getId()}>/${this.getId()}/filterOperator}`,
				}),

				new Label({ text: "Filter Value" }),
				new Input({
					change: this.onStringFilterValueChanged.bind(this),
					value: {
						path: `${table.getId()}>/${this.getId()}/filterValue`,
						type: this.getPropertyBindingType(),
						formatOptions: this.getPropertyBindingFormatOptions()
					}
				})
			]
		});
    }

    private onStringFilterValueChanged(event: InputBase$ChangeEvent): void {
        const id = this.getId();
        const tableId = this.getParent()!.getId();
        const tableSettingsModel = this.getModel(tableId) as JSONModel;

        const value = tableSettingsModel.getProperty(`/${id}/filterValue`) as string;
        const isSelected = value !== null && value !== "";

        tableSettingsModel.setProperty(`/${id}/isSelected`, isSelected);
        tableSettingsModel.setProperty(`/${id}/filterCount`, isSelected ? 1 : 0);
    }
}