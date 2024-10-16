import JSONModel from "sap/ui/model/json/JSONModel";
import Controller from "sap/ui/core/mvc/Controller";
import ViewSettingsDialog, { ViewSettingsDialog$ConfirmEvent } from "sap/m/ViewSettingsDialog";
import FilterOperator from "sap/ui/model/FilterOperator";
import Fragment from "sap/ui/core/Fragment";
import View from "sap/ui/core/mvc/View";
import Control from "sap/ui/core/Control";
import ListBinding from "sap/ui/model/ListBinding";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import Filter from "sap/ui/model/Filter";
import Table from "sap/m/Table";
import Sorter from "sap/ui/model/Sorter";
import Comparator from "../utils/comparator";
import Item from "sap/ui/core/Item";
import { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import { Select$ChangeEvent } from "sap/m/Select";
import { DatePicker$ChangeEvent } from "sap/m/DatePicker";
import { Input$ChangeEvent } from "sap/ui/webc/main/Input";

/**
 * @namespace com.lichter.mobilesortfilter.controller
 */
export default class Overview extends Controller {

    private sortDialog: ViewSettingsDialog
    private filterDialog: ViewSettingsDialog

    //TODO: Export to own Control

    public onInit(): void {
        const dataModel = new JSONModel({
            drivers: [
                {
                    name: "Lewis Hamilton",
                    nationality: "Great Britian",
                    number: "44",
                    birthday: "07.01.1985",
                    team: "Mercedes AMG Petronas F1 Team"
                },
                {
                    name: "George Russel",
                    nationality: "Great Britian",
                    number: "63",
                    birthday: "15.02.1998",
                    team: "Mercedes AMG Petronas F1 Team"
                },
                {
                    name: "Max Verstappen",
                    nationality: "Netherlands",
                    number: "1",
                    birthday: "30.09.1997",
                    team: "Red Bull Racing"
                },
                {
                    name: "Sergio Perez",
                    nationality: "Mexico",
                    number: "11",
                    birthday: "26.01.1990",
                    team: "Red Bull Racing"
                },
                {
                    name: "Charles Leclerc",
                    nationality: "Monaco",
                    number: "16",
                    birthday: "16.10.1997",
                    team: "Scuderia Ferrari"
                },
                {
                    name: "Carlos Sainz",
                    nationality: "Spain",
                    number: "55",
                    birthday: "01.09.1994",
                    team: "Scuderia Ferrari"
                },
                {
                    name: "Fernando Alonso",
                    nationality: "Spain",
                    number: "14",
                    birthday: "29.07.1981",
                    team: "Aston Martin Aramco-Mercedes"
                },
                {
                    name: "Lance Stroll",
                    nationality: "Canada",
                    number: "18",
                    birthday: "29.10.1998",
                    team: "Aston Martin Aramco-Mercedes"
                }
            ]
        });
        const tableSettingsModel = new JSONModel({
            sort: {
                selectedSortItem: ""
            },
            filter: {
                name: {
                    filterCount: 0,
                    isSelected: false,
                    filterOperator: FilterOperator.EQ,
                    value1: ""
                },
                nationality: {
                    filterCount: 0,
                    isSelected: false,
                    filterOperator: FilterOperator.EQ,
                    selectedKeys: ""
                },
                number: {
                    filterCount: 0,
                    isSelected: false,
                    filterOperator: FilterOperator.BT,
                    value1: "",
                    value2: "",
                    isValue2InputVisible: true
                },
                birthday: {
                    filterCount: 0,
                    isSelected: false,
                    filterOperator: FilterOperator.BT,
                    value1: "",
                    value2: "",
                    isValue2InputVisible: true
                },
                team: {
                    filterCount: 0,
                    isSelected: false,
                    filterOperator: FilterOperator.EQ,
                    selectedKeys: ""
                }
            }
        });
        const nationalitiesModel = new JSONModel({
            nationalities: [
                {
                    name: "Great Britian"
                },
                {
                    name: "Netherlands"
                },
                {
                    name: "Mexico"
                },
                {
                    name: "Spain"
                },
                {
                    name: "Canada"
                },
                {
                    name: "Monaco"
                }
            ]
        });

        const teamsModel = new JSONModel({
            teams: [
                {
                    name: "Aston Martin Aramco-Mercedes"
                },
                {
                    name: "Scuderia Ferrari"
                },
                {
                    name: "Red Bull Racing"
                },
                {
                    name: "Mercedes AMG Petronas F1 Team"
                }
            ]
        });

        const view = this.getView();
        view?.setModel(dataModel, "data");
        view?.setModel(tableSettingsModel, "tableSettings");
        view?.setModel(nationalitiesModel, "nationalities");
        view?.setModel(teamsModel, "teams");
    }

    public onOpenSortDialogPressed(): void {
        if (!this.sortDialog) {
            this.openDialog("com.lichter.mobilesortfilter.view.fragments.Sort", this, this.getView())
                .then(dialog => {
                    this.sortDialog = dialog as ViewSettingsDialog;
                    this.sortDialog.open();
                })
                //TODO: Use SAP logger
                // eslint-disable-next-line no-console
                .catch(error => console.log(error));
            return;
        }

        this.sortDialog.open();
    }

    public onOpenFilterDialogPressed(): void {
        if (!this.filterDialog) {
            this.openDialog("com.lichter.mobilesortfilter.view.fragments.Filter", this, this.getView())
                .then(dialog => {
                    this.filterDialog = dialog as ViewSettingsDialog;
                    this.filterDialog.open();
                })
                //TODO: Use SAP logger
                // eslint-disable-next-line no-console
                .catch(error => console.log(error));
            return;
        }

        this.filterDialog.open();
    }

    private openDialog(name: string, controller: Controller, containingView: View | undefined): Promise<Control | Control[]> {
        return Fragment.load({
            name: name,
            controller: controller,
            containingView: containingView
        })
            .then(fragment => {
                if (!Array.isArray(fragment)) {
                    containingView?.addDependent(fragment);
                }

                return fragment;
            });
    }

    public onFilterConfirmed(event: ViewSettingsDialog$ConfirmEvent) {
        const tableSettingsModel = this.getTableSettingsModel();
        const table = this.getTable();
        const itemsBinding: ListBinding = table?.getBinding("items") as ListBinding;
        const filterItems: ViewSettingsItem[] = event.getParameter("filterItems") || [];
        const filters: Filter[] = [];
        
        filterItems.forEach((filterItem) => {
            const filterKey = filterItem.getKey();
            const filterOperator = tableSettingsModel.getProperty(`/filter/${filterKey}/filterOperator`) as FilterOperator;
            const value1 = tableSettingsModel.getProperty(`/filter/${filterKey}/value1`) as string;
            const value2 = tableSettingsModel.getProperty(`/filter/${filterKey}/value2`) as string;
    
            switch (filterKey) {
                case "number": {
                    if (filterOperator === FilterOperator.BT) {
                        filters.push(new Filter({
                            path: filterKey,
                            operator: filterOperator,
                            value1: value1,
                            value2: value2
                        }));
                    } else {
                        filters.push(new Filter({
                            path: filterKey,
                            operator: filterOperator,
                            value1: value1,
                            comparator: Comparator.compareNumbers
                        }));
                    }
                    break;
                }
                case "birthday": {
                    filters.push(new Filter({
                        path: filterKey,
                        operator: filterOperator,
                        value1: value1,
                        value2: value2,
                        comparator: Comparator.compareDateStrings
                    }));
                    break;
                }
                case "nationality":
                case "team": {
                    const selectedKeys = tableSettingsModel.getProperty(`/filter/${filterKey}/selectedKeys`) as string[];
                    const OrFilters: Filter[] = [];
                    selectedKeys.forEach(selectedKey => {
                        OrFilters.push(new Filter({
                            path: filterKey,
                            operator: filterOperator,
                            value1: selectedKey,
                            comparator: Comparator.compareStrings
                        }));
                    });
    
                    filters.push(new Filter({
                        filters: OrFilters,
                        and: false
                    }));
                    break;
                }
                default: {
                    filters.push(new Filter({
                        path: filterKey,
                        operator: filterOperator,
                        value1: value1,
                        comparator: Comparator.compareStrings
                    }));
                    break;
                }
            }
        });
    
        itemsBinding.filter(filters);
    }

    public onSortConfirmed(event: ViewSettingsDialog$ConfirmEvent): void {
        const table = this.getTable();
        const itemsBinding: ListBinding = table.getBinding("items") as ListBinding;

        const sortDescending = event.getParameter("sortDescending") as boolean;
        const sortItem = event.getParameter("sortItem") as Item;

        let comparatorFunction;
        switch (sortItem.getKey()) {
            case "number": {
                comparatorFunction = Comparator.compareNumbers;
                break;
            }
            case "birthday": {
                comparatorFunction = Comparator.compareDateStrings;
                break;
            }
            case "nationality":
            case "team": {
                comparatorFunction = Comparator.compareStrings;
                break;
            }
            default: {
                comparatorFunction = Comparator.compareStrings;
                break;
            }
        }

        itemsBinding.sort(new Sorter(
            sortItem.getKey(),
            sortDescending,
            false,
            comparatorFunction
        ));
    }

    public onResetFiltersPressed() {
        const table = this.byId("table");
        const itemsBinding: ListBinding = table?.getBinding("items") as ListBinding;

        itemsBinding.filter([]);

        const tableSettingsModel = this.getTableSettingsModel();

        tableSettingsModel.setProperty("/filter/name/filterCount", 0);
        tableSettingsModel.setProperty("/filter/name/isSelected", false);
        tableSettingsModel.setProperty("/filter/name/filterOperator", FilterOperator.EQ);
        tableSettingsModel.setProperty("/filter/name/value1", "");

        tableSettingsModel.setProperty("/filter/nationality/filterCount", 0);
        tableSettingsModel.setProperty("/filter/nationality/isSelected", false);
        tableSettingsModel.setProperty("/filter/nationality/selectedKeys", "");

        tableSettingsModel.setProperty("/filter/number/filterCount", 0);
        tableSettingsModel.setProperty("/filter/number/isSelected", false);
        tableSettingsModel.setProperty("/filter/number/filterOperator", FilterOperator.EQ);
        tableSettingsModel.setProperty("/filter/number/value1", "");

        tableSettingsModel.setProperty("/filter/birthday/filterCount", 0);
        tableSettingsModel.setProperty("/filter/birthday/isSelected", false);
        tableSettingsModel.setProperty("/filter/birthday/value", "");

        tableSettingsModel.setProperty("/filter/team/filterCount", 0);
        tableSettingsModel.setProperty("/filter/team/isSelected", false);
        tableSettingsModel.setProperty("/filter/team/selectedKeys", "");
    }

    public onResetSortingPressed() {
        const table = this.byId("table");
        const itemsBinding: ListBinding = table?.getBinding("items") as ListBinding;

        itemsBinding.sort([]);
    }

    public onFilterSelectionFinished(event: MultiComboBox$SelectionFinishEvent) {
        const source = event.getSource() as Control;
        const filterKey = source.data("key") as string;
        const selectedItems: Item[] = event.getParameters().selectedItems as Item[];

        const tableSettingsModel = this.getTableSettingsModel();
        tableSettingsModel.setProperty(`/filter/${filterKey}/isSelected`, selectedItems.length > 0);
        tableSettingsModel.setProperty(`/filter/${filterKey}/filterCount`, selectedItems.length);
    }

    public onDateFilterSelectionChanged(event: Select$ChangeEvent) {
        const source = event.getSource() as Control;
        const filterKey = source.data("key") as string;
        const tableSettingsModel = this.getTableSettingsModel();
        const selectedFilterOperator = tableSettingsModel.getProperty(`/filter/${filterKey}/filterOperator`) as FilterOperator;

        tableSettingsModel.setProperty(
            `/filter/${filterKey}/isValue2InputVisible`,
            selectedFilterOperator === FilterOperator.BT
        );

        this.updateDateFilterSelectionStatus(filterKey);
    }

    public onDateFilterValueChanged(event: DatePicker$ChangeEvent) {
        const source = event.getSource() as Control;

        this.updateDateFilterSelectionStatus(source.data("key") as string);
    }

    public onStringFilterValueChanged(event: Input$ChangeEvent) {
        const source = event.getSource() as Control;
        const filterKey = source.data("key") as string;

        const tableSettingsModel = this.getTableSettingsModel();
        const value = tableSettingsModel.getProperty(`/filter/${filterKey}/value`) as string;

        const isSelected = value !== null && value !== "";
        tableSettingsModel.setProperty(`/filter/${filterKey}/isSelected`, isSelected);
        tableSettingsModel.setProperty(`/filter/${filterKey}/filterCount`, isSelected ? 1 : 0);
    }

    public onNumberFilterSelectionChanged(event: Select$ChangeEvent) {
        const source = event.getSource() as Control;
        const filterKey = source.data("key") as string;
        const tableSettingsModel = this.getTableSettingsModel();
        const selectedFilterOperator = tableSettingsModel.getProperty(`/filter/${filterKey}/filterOperator`) as FilterOperator;

        tableSettingsModel.setProperty(
            `/filter/${filterKey}/isValue2InputVisible`,
            selectedFilterOperator === FilterOperator.BT
        );

        this.updateDateFilterSelectionStatus(filterKey);
    }

    public onNumberFilterValueChanged(event: Input$ChangeEvent) {
        const source = event.getSource() as Control;
        const filterKey = source.data("key") as string;

        const tableSettingsModel = this.getTableSettingsModel();
        const filterOperator = tableSettingsModel.getProperty(`/filter/${filterKey}/filterOperator`) as string;
        const value1 = tableSettingsModel.getProperty(`/filter/${filterKey}/value1`) as string;
        const value2 = tableSettingsModel.getProperty(`/filter/${filterKey}/value2`) as string;

        let isSelected = value1 !== null && value1 !== "";
        if (filterOperator === FilterOperator.BT) {
            isSelected = isSelected && value2 !== null && value2 !== "";
        }

        tableSettingsModel.setProperty(`/filter/${filterKey}/isSelected`, isSelected);
        tableSettingsModel.setProperty(`/filter/${filterKey}/filterCount`, isSelected ? 1 : 0);
    }

    private updateDateFilterSelectionStatus(filterKey: string) {
        const tableSettingsModel = this.getTableSettingsModel();
        const filterOperator = tableSettingsModel.getProperty(`/filter/${filterKey}/filterOperator`) as string;
        const dateFilterValue1 = tableSettingsModel.getProperty(`/filter/${filterKey}/value1`) as string;
        const dateFilterValue2 = tableSettingsModel.getProperty(`/filter/${filterKey}/value2`) as string;

        let isSelected = !!dateFilterValue1;
        if (filterOperator === FilterOperator.BT) {
            isSelected = isSelected && !!dateFilterValue2;
        }

        tableSettingsModel.setProperty(`/filter/${filterKey}/isSelected`, isSelected);
        tableSettingsModel.setProperty(`/filter/${filterKey}/filterCount`, isSelected ? 1 : 0);
    }

    private getTable(): Table {
        return this.byId("table") as Table;
    }

    private getTableSettingsModel(): JSONModel {
        return this.getView()?.getModel("tableSettings") as JSONModel;
    }
}