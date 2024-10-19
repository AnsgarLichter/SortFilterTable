import Label from "sap/m/Label";
import Select from "sap/m/Select";
import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Item from "sap/ui/core/Item";
import FilterOperator from "sap/ui/model/FilterOperator";
import SortFilterColumn from "./SortFilterColumn";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Control from "sap/ui/core/Control";
import Input from "sap/m/Input";
import Filter from "sap/ui/model/Filter";
import FilterItem from "./utils/filterItem";

/**
 * @name com.lichter.lib.SortFilterColumnNumber
 */
export default class SortFilterColumnNumber extends SortFilterColumn {

    private filterItemHelper: FilterItem;

    static readonly metadata: MetadataOptions = {
        properties: {},
        aggregations: {}
    };

    init(): void {
        super.init();

        this.filterItemHelper = new FilterItem(this.getId());
    }

    public getDefaultFilterSettings(): object {
        return {
            filterOperator: FilterOperator.BT,
            filterValue: "",
            filterValue2: "",
            filterCount: 0,
            isSelected: false
        };
    }

    public getFilterForm(): Control {
        const parentId = this.getParent().getId();
        const resourceBundle = this.getResourceBundle();

        return new SimpleForm({
            content: [
                new Label({ text: resourceBundle.getText("lichter.mobilesortfilter.filter.item.operator.label") }),
                new Select({
                    items: [
                        new Item({ key: FilterOperator.BT, text: resourceBundle.getText("lichter.mobilesortfilter.filter.operator.bt") }),
                        new Item({ key: FilterOperator.EQ, text: resourceBundle.getText("lichter.mobilesortfilter.filter.operator.equals") }),
                        new Item({ key: FilterOperator.GT, text: resourceBundle.getText("lichter.mobilesortfilter.filter.operator.gt") }),
                        new Item({ key: FilterOperator.GE, text: resourceBundle.getText("lichter.mobilesortfilter.filter.operator.ge") }),
                        new Item({ key: FilterOperator.LE, text: resourceBundle.getText("lichter.mobilesortfilter.filter.operator.le") }),
                        new Item({ key: FilterOperator.LT, text: resourceBundle.getText("lichter.mobilesortfilter.filter.operator.lt") }),
                        new Item({ key: FilterOperator.NE, text: resourceBundle.getText("lichter.mobilesortfilter.filter.operator.ne") }),
                    ],
                    change: this.onNumberFilterOperatorChanged.bind(this),
                    selectedKey: `{${parentId}>/${this.getId()}/filterOperator}`
                }),

                new Label({ text: resourceBundle.getText("lichter.mobilesortfilter.filter.item.number.value1.label") }),
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
                    text: resourceBundle.getText("lichter.mobilesortfilter.filter.item.number.value2.label")
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

    public getFilterItem(): Filter {
        const id = this.getId();
        const tableSettingsModel = this.getTableSettingsModel();

        const filterOperator = tableSettingsModel.getProperty(`/${id}/filterOperator`) as FilterOperator;
        const filterValue = tableSettingsModel.getProperty(`/${id}/filterValue`) as string;
        const filterValue2 = tableSettingsModel.getProperty(`/${id}/filterValue2`) as string;
        const comparator = this.getSortComparator() as ((p1: unknown, p2: unknown) => number);

        return new Filter({
            path: this.getTargetProperty(),
            operator: filterOperator,
            value1: filterValue,
            value2: filterValue2,
            comparator: comparator
        });
    }

    private onNumberFilterOperatorChanged(): void {
        this.filterItemHelper.clearFilterValue2();
        this.filterItemHelper.updateFilterStatus();
    }

    private onNumberFilterValueChanged(): void {
        this.filterItemHelper.updateFilterStatus();
    }


}