import type { MetadataOptions } from "sap/ui/core/Element";
import type { SortFilterColumnFilterType } from "./SortFilterColumnFilterType";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Label from "sap/m/Label";
import Input from "sap/m/Input";
import Select from "sap/m/Select";
import Item from "sap/ui/core/Item";
import FilterOperator from "sap/ui/model/FilterOperator";
import SortFilterColumn from "./SortFilterColumn";
import { InputBase$ChangeEvent } from "sap/m/InputBase";

/**
 * @namespace com.lichter.mobilesortfilter.control
 */
export default class SortFilterColumnFilter extends Control {
    
    constructor(idOrSettings?: string | $SortFilterColumnFilterSettings);
	constructor(id?: string, settings?: $SortFilterColumnFilterSettings);
	constructor(id?: string, settings?: $SortFilterColumnFilterSettings) { super(id, settings); }

    protected isInitalRenderingDone: boolean = false;

    static metadata: MetadataOptions = {
        properties: {
            "propertyBindingType": { type: "sap.ui.model.Type", defaultValue: null },
            "propertyBindingFormatOptions": { type: "object", defaultValue: null },
        },
        aggregations: {
            "_form": { 
                type: "sap.ui.layout.form.SimpleForm", 
                multiple: false, 
                visibility: "hidden"
            },
        }
    };

    static renderer = {
		apiVersion: 2,
		render: function (rm: RenderManager, control: SortFilterColumnFilter): void {
			rm.openStart("div", control);
			rm.openEnd();
            
            rm.renderControl(control.getAggregation("_form") as SimpleForm);

			rm.close("div");
		}
	};

    onBeforeRendering(): void | undefined {
        if (!this.isInitalRenderingDone) {
            this.createFilterForm();
            this.isInitalRenderingDone = true;
        }
    }

    protected createFilterForm() {
        //TODO: Parent is the ViewSettingsDialog and not the SortFilterColumn
        // Same ID for ViewSettingsCustomItem than for SortFilterColumn?
        // Or just use a property?

        //SOLUTION: Move logic to SortFilterColumn and define multiple types of the column
        const column = this.getParent() as SortFilterColumn;
        const form = new SimpleForm({
			content: [
				new Label({ text: "Filter Operator" }),
				new Select({
					items: [
						new Item({ key: FilterOperator.EQ, text: "Contains" }),
						new Item({ key: FilterOperator.Contains, text: "Equals" }),
					],
					selectedKey: `{${this.getId()}>/${column.getId()}/filterOperator}`,
				}),

				new Label({ text: "Filter Value" }),
				new Input({
					change: this.onStringFilterValueChanged.bind(this),
					value: {
                        // TODO: How to bind to expected model?
						path: `${this.getId()}>/${column.getId()}/filterValue`,
						type: this.getPropertyBindingType(),
						formatOptions: this.getPropertyBindingFormatOptions()
					}
				})
			]
		});

        this.setAggregation("_form", form);
    }

    private onStringFilterValueChanged(event: InputBase$ChangeEvent): void {
        throw new Error("Method not implemented.");
    }
}