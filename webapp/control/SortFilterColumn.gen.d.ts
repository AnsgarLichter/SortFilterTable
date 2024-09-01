import Type from "sap/ui/model/Type";
import SortFilterColumnFilter from "com/lichter/mobilesortfilter/control/SortFilterColumnFilter";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ColumnSettings } from "sap/m/Column";

declare module "./SortFilterColumn" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SortFilterColumnSettings extends $ColumnSettings {
        targetProperty?: string | PropertyBindingInfo;
        sortComparator?: Function | PropertyBindingInfo | `{${string}}`;
        propertyBindingType?: Type | PropertyBindingInfo | `{${string}}`;
        propertyBindingFormatOptions?: object | PropertyBindingInfo | `{${string}}`;
        filter?: SortFilterColumnFilter;
    }

    export default interface SortFilterColumn {

        // property: targetProperty
        getTargetProperty(): string;
        setTargetProperty(targetProperty: string): this;

        // property: sortComparator
        getSortComparator(): Function;
        setSortComparator(sortComparator: Function): this;

        // property: propertyBindingType
        getPropertyBindingType(): Type;
        setPropertyBindingType(propertyBindingType: Type): this;

        // property: propertyBindingFormatOptions
        getPropertyBindingFormatOptions(): object;
        setPropertyBindingFormatOptions(propertyBindingFormatOptions: object): this;

        // aggregation: filter
        getFilter(): SortFilterColumnFilter;
        setFilter(filter: SortFilterColumnFilter): this;
        destroyFilter(): this;
    }
}
