import DataType from "sap/ui/base/DataType";


/**
* Enumeration of data types to be sorted and filtered.
* 
* @namespace com.lichter.mobilesortfilter.control.SortFilterColumnDataType
* 
* @enum {string}
* @public
*/
export enum SortFilterColumnDataType {
    String = "String",
    Number = "Number",
    Date = "Date"
};

DataType.registerEnum("com.lichter.mobilesortfilter.control.SortFilterColumnDataType", SortFilterColumnDataType);