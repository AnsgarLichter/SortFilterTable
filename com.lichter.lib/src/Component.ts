import Log from "sap/base/Log";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace com.lichter.lib
 */
export default class ComLichterLibComponent extends UIComponent {

    public static metadata = {
		manifest: "json",
	};

    public init(): void {
        super.init();

        void this.enhanceResourceModel();
    }

    private async enhanceResourceModel() {
        const resourceModel = this.getModel("i18n") as ResourceModel;
        if(!resourceModel) {
            Log.warning("Resource model not found. Skipping enhancement.");
            return;
        }

        const libs = this.getManifestEntry("/sap.ui5/dependencies/libs") as object;
        for(const lib in libs) {
            const bundleName = `${lib}.messagebundle`;
            await resourceModel.enhance({
                bundleName: bundleName
            });
        }
    }
}