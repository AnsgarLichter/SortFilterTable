import Label from "sap/m/Label";
import { MetadataOptions } from "sap/ui/base/ManagedObject";
import Item from "sap/ui/core/Item";
import SortFilterColumn from "./SortFilterColumn";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Control from "sap/ui/core/Control";
import MultiComboBox, { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumnSelect extends SortFilterColumn {
 
	static readonly metadata: MetadataOptions = {
		properties: {
            "masterdataItemsBinding": { type: "string", defaultValue: null },
            "masterdataKeyBinding": { type: "string", defaultValue: null },
            "masterdataTextBinding": { type: "string", defaultValue: null }
        },
        aggregations: {}
	};

	public getDefaultFilterSettings(): object {
        return {
            selectedKeys: [],
            filterCount: 0,
            isSelected: false
        };
    }

	public getFilterForm(): Control {
        return new SimpleForm({
			content: [
				new Label({ text: "{i18n>lichter.mobilesortfilter.filter.item.select.items.label}" }),
				new MultiComboBox({
					items: {
						path: `${this.getMasterdataItemsBinding()}`,
						template: new Item({
							key: `{${this.getMasterdataKeyBinding()}}`,
							text: `{${this.getMasterdataTextBinding()}}`
						})
					},
					selectedKeys: `{${this.getId()}>/${this.getId()}/selectedKeys}`,
					selectionFinish: this.onItemsSelectionFinished.bind(this),
				}),
			]
		});
    }

	public getFilterItem(): Filter {
        const id = this.getId();
        const tableSettingsModel = this.getTableSettingsModel();

        const filterValues = tableSettingsModel.getProperty(`/${id}/selectedKeys`) as string[];
        const comparator = this.getSortComparator() as ((p1: any, p2: any) => number);
        
		const OrFilters: Filter[] = [];
		filterValues.forEach((filterValue: string) => {
			OrFilters.push(new Filter({	
				path: this.getTargetProperty(),
				operator: FilterOperator.EQ,
				value1: filterValue,
				comparator: comparator
			}));
		});

        return new Filter({
            filters: OrFilters,
			and: false
        });
    }

    private onItemsSelectionFinished(event: MultiComboBox$SelectionFinishEvent): void {
		this.updateSelectedKeys(event);
		this.updateFilterStatus(event);
    }

	private updateSelectedKeys(event: MultiComboBox$SelectionFinishEvent) {
		const tableSettingsModel = this.getTableSettingsModel();
		const selectedItems = event.getParameter("selectedItems");
		const selectedKeys = selectedItems?.map((item: Item) => item.getKey()) || [];

		tableSettingsModel.setProperty(`/${this.getId()}/selectedKeys`, selectedKeys);
	}

	private updateFilterStatus(event: MultiComboBox$SelectionFinishEvent) {
		const tableSettingsModel = this.getTableSettingsModel();
		const selectedItems = event.getParameter("selectedItems");
		const isSelected = selectedItems && selectedItems.length > 0;

		tableSettingsModel.setProperty(`/${this.getId()}/isSelected`, isSelected);
		tableSettingsModel.setProperty(`/${this.getId()}/filterCount`, isSelected ? 1 : 0);
	}
}