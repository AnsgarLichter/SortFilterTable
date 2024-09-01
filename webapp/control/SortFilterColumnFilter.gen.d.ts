import Type from "sap/ui/model/Type";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./SortFilterColumnFilter" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SortFilterColumnFilterSettings extends $ControlSettings {
        propertyBindingType?: Type | PropertyBindingInfo | `{${string}}`;
        propertyBindingFormatOptions?: object | PropertyBindingInfo | `{${string}}`;
    }

    export default interface SortFilterColumnFilter {

        // property: propertyBindingType
        getPropertyBindingType(): Type;
        setPropertyBindingType(propertyBindingType: Type): this;

        // property: propertyBindingFormatOptions
        getPropertyBindingFormatOptions(): object;
        setPropertyBindingFormatOptions(propertyBindingFormatOptions: object): this;
    }
}
