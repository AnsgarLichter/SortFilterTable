/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comlichter/mobile_sort_filter/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
