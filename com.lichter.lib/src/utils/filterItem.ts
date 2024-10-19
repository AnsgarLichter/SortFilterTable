import Element from 'sap/ui/core/Element';
import FilterOperator from "sap/ui/model/FilterOperator";
import JSONModel from "sap/ui/model/json/JSONModel";
import SortFilterColumn from '../SortFilterColumn';

/**
 * @name com.lichter.lib.utils.FilterItem
 */
export default class FilterItem {
    constructor(private columnId: string) {}

    public clearFilterValue2() {
        const tableSettingsModel = this.getTableSettingsModel();

        const filterOperator = tableSettingsModel.getProperty(`/${this.columnId}/filterOperator`) as FilterOperator;
        if (filterOperator !== FilterOperator.BT) {
            tableSettingsModel.setProperty(`/${this.columnId}/filterValue2`, "");
        }
    }

    public updateFilterStatus() {
        const tableSettingsModel = this.getTableSettingsModel();
        const filterOperator = tableSettingsModel.getProperty(`/${this.columnId}/filterOperator`) as FilterOperator;
        const value1 = tableSettingsModel.getProperty(`/${this.columnId}/filterValue`) as string;
        const value2 = tableSettingsModel.getProperty(`/${this.columnId}/filterValue2`) as string;

        let isSelected = value1 !== null && value1 !== "";
        if (filterOperator === FilterOperator.BT) {
            isSelected = isSelected && value2 !== null && value2 !== "";
        }

        tableSettingsModel.setProperty(`/${this.columnId}/isSelected`, isSelected);
        tableSettingsModel.setProperty(`/${this.columnId}/filterCount`, isSelected ? 1 : 0);
    }

    protected getTableSettingsModel() {
        const column = Element.getElementById(this.columnId) as SortFilterColumn;
        const table = column.getParent();

        return table.getModel(table.getId()) as JSONModel;
    }
}