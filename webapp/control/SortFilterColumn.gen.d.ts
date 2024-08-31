import SortFilterColumnDataType from "com/lichter/mobilesortfilter/control/SortFilterColumnDataType";
import Type from "sap/ui/model/Type";
import ViewSettingsDialog from "sap/m/ViewSettingsDialog";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ColumnSettings } from "sap/m/Column";

declare module "./SortFilterColumn" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SortFilterColumnSettings extends $ColumnSettings {
        targetProperty?: string | PropertyBindingInfo;
        dataType?: SortFilterColumnDataType | PropertyBindingInfo | `{${string}}`;
        filterPropertyBindingType?: Type | PropertyBindingInfo | `{${string}}`;
        filterPropertyBindingFormatOptions?: object | PropertyBindingInfo | `{${string}}`;
        _sortDialog?: ViewSettingsDialog;
        _filterDialog?: ViewSettingsDialog;
    }

    export default interface SortFilterColumn {

        // property: targetProperty
        getTargetProperty(): string;
        setTargetProperty(targetProperty: string): this;

        // property: dataType
        getDataType(): SortFilterColumnDataType;
        setDataType(dataType: SortFilterColumnDataType): this;

        // property: filterPropertyBindingType
        getFilterPropertyBindingType(): Type;
        setFilterPropertyBindingType(filterPropertyBindingType: Type): this;

        // property: filterPropertyBindingFormatOptions
        getFilterPropertyBindingFormatOptions(): object;
        setFilterPropertyBindingFormatOptions(filterPropertyBindingFormatOptions: object): this;

        // aggregation: _sortDialog
        get_sortDialog(): ViewSettingsDialog;
        set_sortDialog(_sortDialog: ViewSettingsDialog): this;
        destroy_sortDialog(): this;

        // aggregation: _filterDialog
        get_filterDialog(): ViewSettingsDialog;
        set_filterDialog(_filterDialog: ViewSettingsDialog): this;
        destroy_filterDialog(): this;
    }
}
