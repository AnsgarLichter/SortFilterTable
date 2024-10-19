# SortFilterTable

This repository contains a UI5 TypeScript application and a UI5 TypeScript library with the custom developed control `SortFilterTable`.
This table builds upon `sap.m.Table` and generates the `ViewSettingsDialog` for filtering and sorting the table items automatically.

If you have any issues or feedback, please let me know.

## Remarks

### UI5 Workspaces

To my current understanding of UI5 workspaces, the `ui5-workspace.yaml` should be sufficient to use the library:

```yaml
specVersion: workspace/1.0
metadata:
    name: default
dependencyManagement:
    resolutions:
        - path: ../com.lichter.lib
```

Somehow the library is only recognized and served correctly, if both are linked via `npm link` resulting in this dependency:

```json
"dependencies": {
    "com.lichter.lib": "file:../com.lichter.lib"
}
```

### Transpiling Dependencies

To transpile a dependency, e. g. a UI5 TypeScript library, the library must be added to the `types` of the `tsconfig.json` (see [fix(ui5-tooling-transpile): derive transpileDependencies from tsconfig](https://github.com/ui5-community/ui5-ecosystem-showcase/pull/786/files)):

```json
"types": [
    "@sapui5/types", 
    "@types/qunit", 
    "com.lichter.lib"
],
```

If the other requirements are met, the library will be transpiled and be able to be used in the application.

### Library's translations

The libraries texts in the `messagebundle.properties` do not get served when the FIORI launchpad sandbox is used. If you know how to fix this, please let me know.

## Future Enhancements

- [ ] Sample page included in the library
- [ ] Unit tests for the custom controls
- [ ] Integration tests for the whole lifecycle of the  `SortFilterTable`.