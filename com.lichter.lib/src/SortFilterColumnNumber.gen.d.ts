import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $SortFilterColumnSettings } from "./SortFilterColumn";

declare module "./SortFilterColumnSelect" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SortFilterColumnNumberSettings extends $SortFilterColumnSettings {
        masterdataItemsBinding?: string | PropertyBindingInfo;
        masterdataKeyBinding?: string | PropertyBindingInfo;
        masterdataTextBinding?: string | PropertyBindingInfo;
    }

    export default interface SortFilterColumnNumber {

        // property: masterdataItemsBinding
        getMasterdataItemsBinding(): string;
        setMasterdataItemsBinding(masterdataItemsBinding: string): this;

        // property: masterdataKeyBinding
        getMasterdataKeyBinding(): string;
        setMasterdataKeyBinding(masterdataKeyBinding: string): this;

        // property: masterdataTextBinding
        getMasterdataTextBinding(): string;
        setMasterdataTextBinding(masterdataTextBinding: string): this;
    }
}
