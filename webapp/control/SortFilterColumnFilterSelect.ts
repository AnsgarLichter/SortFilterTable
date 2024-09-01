import type { MetadataOptions } from "sap/ui/core/Element";
import type { SortFilterColumnFilterType } from "./SortFilterColumnFilterType";
import SortFilterColumnFilter from "./SortFilterColumnFilter";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumnFilterSelect extends SortFilterColumnFilter {

    constructor(idOrSettings?: string | $SortFilterColumnFilterSelectSettings);
	constructor(id?: string, settings?: $SortFilterColumnFilterSelectSettings);
	constructor(id?: string, settings?: $SortFilterColumnFilterSelectSettings) { super(id, settings); }

    static readonly metadata: MetadataOptions = {
        properties: {
            "masterdataItemsBinding": { type: "string", defaultValue: null },
            "masterdataKeyBinding": { type: "string", defaultValue: null },
            "masterdataTextBinding": { type: "string", defaultValue: null },
        },
        aggregations: {
            "masterdataItems": { type: "sap.ui.core.Item", multiple: true, singularName: "masterdataItem" },
        }
    };
}