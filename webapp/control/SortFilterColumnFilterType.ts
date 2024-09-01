import DataType from "sap/ui/base/DataType";


/**
* Enumeration of data types to be sorted and filtered.
* 
* @namespace com.lichter.mobilesortfilter.control.SortFilterColumnDataType
* 
* @enum {string}
* @public
*/
export enum SortFilterColumnFilterType {
    String = "String",
    Number = "Number",
    Date = "Date",
    Select = "Select",
};

DataType.registerEnum(
    "com.lichter.mobilesortfilter.control.SortFilterColumnFilterType", 
    SortFilterColumnFilterType
);