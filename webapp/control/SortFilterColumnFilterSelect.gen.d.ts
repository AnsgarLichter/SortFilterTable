import Item from "sap/ui/core/Item";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $SortFilterColumnFilterSettings } from "./SortFilterColumnFilter";

declare module "./SortFilterColumnFilterSelect" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SortFilterColumnFilterSelectSettings extends $SortFilterColumnFilterSettings {
        masterdataItemsBinding?: string | PropertyBindingInfo;
        masterdataKeyBinding?: string | PropertyBindingInfo;
        masterdataTextBinding?: string | PropertyBindingInfo;
        masterdataItems?: Item[] | Item | AggregationBindingInfo | `{${string}}`;
    }

    export default interface SortFilterColumnFilterSelect {

        // property: masterdataItemsBinding
        getMasterdataItemsBinding(): string;
        setMasterdataItemsBinding(masterdataItemsBinding: string): this;

        // property: masterdataKeyBinding
        getMasterdataKeyBinding(): string;
        setMasterdataKeyBinding(masterdataKeyBinding: string): this;

        // property: masterdataTextBinding
        getMasterdataTextBinding(): string;
        setMasterdataTextBinding(masterdataTextBinding: string): this;

        // aggregation: masterdataItems
        getMasterdataItems(): Item[];
        addMasterdataItem(masterdataItems: Item): this;
        insertMasterdataItem(masterdataItems: Item, index: number): this;
        removeMasterdataItem(masterdataItems: number | string | Item): this;
        removeAllMasterdataItems(): Item[];
        indexOfMasterdataItem(masterdataItems: Item): number;
        destroyMasterdataItems(): this;
    }
}
