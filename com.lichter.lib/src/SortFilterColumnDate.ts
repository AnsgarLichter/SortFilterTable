import DatePicker from "sap/m/DatePicker";
import Label from "sap/m/Label";
import Select from "sap/m/Select";
import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Item from "sap/ui/core/Item";
import FilterOperator from "sap/ui/model/FilterOperator";
import SortFilterColumn from "./SortFilterColumn";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import SortFilterTable from "./SortFilterTable";
import Control from "sap/ui/core/Control";
import Filter from "sap/ui/model/Filter";
import FilterItem from "./utils/filterItem";

/**
 * @name com.lichter.lib.SortFilterColumnDate
 */
export default class SortFilterColumnDate extends SortFilterColumn {
	
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
        const table = this.getParent() as SortFilterTable;
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
					selectedKey: `{${table.getId()}>/${this.getId()}/filterOperator}`,
					change: this.onDateFilterOperatorChanged.bind(this)
				}),

				new Label({ text: resourceBundle.getText("lichter.mobilesortfilter.filter.item.date.begin.label") }),
				new DatePicker({
					value: {
						path: `${table.getId()}>/${this.getId()}/filterValue`,
						type: this.getPropertyBindingType(),
						formatOptions: this.getPropertyBindingFormatOptions()
					},
					change: this.onDateFilterValueChanged.bind(this)
				}),

				new Label({
					visible: `{= \${${table.getId()}>/${this.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
					text: resourceBundle.getText("lichter.mobilesortfilter.filter.item.date.end.label")
				}),
				new DatePicker({
					visible: `{= \${${table.getId()}>/${this.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
					value: {
						path: `${table.getId()}>/${this.getId()}/filterValue2`,
						type: this.getPropertyBindingType(),
						formatOptions: this.getPropertyBindingFormatOptions()
					},
					change: this.onDateFilterValueChanged.bind(this)
				})
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

    private onDateFilterOperatorChanged(): void {
		this.filterItemHelper.clearFilterValue2();
        this.filterItemHelper.updateFilterStatus();
	}

	private onDateFilterValueChanged(): void {
		this.filterItemHelper.updateFilterStatus();
	}
}