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
import Filter from "sap/ui/model/Filter";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumn extends Column {

    constructor(idOrSettings?: string | $SortFilterColumnSettings);
    constructor(id?: string, settings?: $SortFilterColumnSettings);
    constructor(id?: string, settings?: $SortFilterColumnSettings) { super(id, settings); }

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

    public getFilterForm(): Control {
        const table = this.getParent() as SortFilterTable;

        return new SimpleForm({
			content: [
				new Label({ text: "{i18n>lichter.mobilesortfilter.filter.item.operator.label}" }),
				new Select({
					items: [
						new Item({ key: FilterOperator.EQ, text: "{i18n>lichter.mobilesortfilter.filter.operator.equals}" }),
						new Item({ key: FilterOperator.Contains, text: "{i18n>lichter.mobilesortfilter.filter.operator.contains}" }),
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

    public getFilterItem(): Filter {
        const id = this.getId();
        const tableSettingsModel = this.getTableSettingsModel();

        const filterOperator = tableSettingsModel.getProperty(`/${id}/filterOperator`) as FilterOperator;
        const filterValue = tableSettingsModel.getProperty(`/${id}/filterValue`) as string;
        const comparator = this.getSortComparator() as ((p1: any, p2: any) => number);

        return new Filter({
            path: this.getTargetProperty(),
            operator: filterOperator,
            value1: filterValue,
            comparator: comparator
        });
    }

    protected getTableSettingsModel() {
        const tableId = this.getParent()!.getId();
        const tableSettingsModel = this.getModel(tableId) as JSONModel;

        return tableSettingsModel;
    }

    private onStringFilterValueChanged(event: InputBase$ChangeEvent): void {
        const id = this.getId();
        const tableSettingsModel = this.getTableSettingsModel();

        const value = tableSettingsModel.getProperty(`/${id}/filterValue`) as string;
        const isSelected = value !== null && value !== "";

        tableSettingsModel.setProperty(`/${id}/isSelected`, isSelected);
        tableSettingsModel.setProperty(`/${id}/filterCount`, isSelected ? 1 : 0);
    }
}