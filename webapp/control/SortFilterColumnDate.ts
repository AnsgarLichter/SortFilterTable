import DatePicker from "sap/m/DatePicker";
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

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumnDate extends SortFilterColumn {
 
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
					selectedKey: `{${table.getId()}>/${this.getId()}/filterOperator}`,
					change: this.onDateFilterOperatorChanged.bind(this)
				}),

				new Label({ text: "Begin Date" }),
				new DatePicker({
					value: {
						path: `${table.getId()}>/${this.getId()}/filterValue`,
						type: this.getPropertyBindingType(),
						formatOptions: this.getPropertyBindingFormatOptions()
					},
					change: this.onDateFilterValueChanged.bind(this)
				}),

				new Label({
					visible: `{= \${${this.getId()}>/${this.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
					text: "End Date"
				}),
				new DatePicker({
					visible: `{= \${${this.getId()}>/${this.getId()}/filterOperator} === '${FilterOperator.BT}'}`,
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

    private onDateFilterOperatorChanged(event: Select$ChangeEvent): void {
		throw new Error("Method not implemented.");
	}

	private onDateFilterValueChanged(event: InputBase$ChangeEvent): void {
		throw new Error("Method not implemented.");
	}
}