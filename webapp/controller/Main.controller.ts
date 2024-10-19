import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.lichter.mobilesortfilter.controller
 */
export default class Main extends BaseController {
	
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
        view?.setModel(nationalitiesModel, "nationalities");
        view?.setModel(teamsModel, "teams");
    }
}
