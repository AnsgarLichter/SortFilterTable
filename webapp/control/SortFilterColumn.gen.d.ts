import SortFilterColumnDataType from "com/lichter/mobilesortfilter/control/SortFilterColumnDataType";
import ViewSettingsDialog from "sap/m/ViewSettingsDialog";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ColumnSettings } from "sap/m/Column";

declare module "./SortFilterColumn" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SortFilterColumnSettings extends $ColumnSettings {
        dataType?: SortFilterColumnDataType | PropertyBindingInfo | `{${string}}`;
        sortProperty?: string | PropertyBindingInfo;
        _sortDialog?: ViewSettingsDialog;
        _filterDialog?: ViewSettingsDialog;
    }

    export default interface SortFilterColumn {

        // property: dataType
        getDataType(): SortFilterColumnDataType;
        setDataType(dataType: SortFilterColumnDataType): this;

        // property: sortProperty
        getSortProperty(): string;
        setSortProperty(sortProperty: string): this;

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
