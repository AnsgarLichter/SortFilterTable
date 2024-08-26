import Column from "sap/m/Column";
import { MetadataOptions } from "sap/ui/core/Element";

/**
 * @namespace com.lichter.mobilesortfilter.control.SortFilterColumn
 */
export default class SortFilterColumn extends Column {

    constructor(idOrSettings?: string | $SortFilterColumnSettings);
    constructor(id?: string, settings?: $SortFilterColumnSettings);
    constructor(id?: string, settings?: $SortFilterColumnSettings) { super(id, settings); }

    static readonly metadata: MetadataOptions = {
        properties: {
            "dataType": "com.lichter.mobilesortfilter.control.SortFilterColumnDataType",
            "sortProperty": { type: "string", defaultValue: "" },
        },
        aggregations: {
            "_sortDialog": { type: "sap.m.ViewSettingsDialog", multiple: false },
            "_filterDialog": { type: "sap.m.ViewSettingsDialog", multiple: false },
        },
    };
}