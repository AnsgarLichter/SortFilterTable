import SortFilterColumn from "com/lichter/mobilesortfilter/control/SortFilterColumn";
import ViewSettingsDialog from "sap/m/ViewSettingsDialog";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $TableSettings } from "sap/m/Table";

declare module "./SortFilterTable" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SortFilterTableSettings extends $TableSettings {
        title?: string | PropertyBindingInfo;
        createSortDialog?: boolean | PropertyBindingInfo | `{${string}}`;
        createFilterDialog?: boolean | PropertyBindingInfo | `{${string}}`;
        columns?: SortFilterColumn[] | SortFilterColumn | AggregationBindingInfo | `{${string}}`;
        _sortDialog?: ViewSettingsDialog;
        _filterDialog?: ViewSettingsDialog;
    }

    export default interface SortFilterTable {

        // property: title
        getTitle(): string;
        setTitle(title: string): this;

        // property: createSortDialog
        getCreateSortDialog(): boolean;
        setCreateSortDialog(createSortDialog: boolean): this;

        // property: createFilterDialog
        getCreateFilterDialog(): boolean;
        setCreateFilterDialog(createFilterDialog: boolean): this;

        // aggregation: columns
        getColumns(): SortFilterColumn[];
        addColumn(columns: SortFilterColumn): this;
        insertColumn(columns: SortFilterColumn, index: number): this;
        removeColumn(columns: number | string | SortFilterColumn): this;
        removeAllColumns(): SortFilterColumn[];
        indexOfColumn(columns: SortFilterColumn): number;
        destroyColumns(): this;

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
