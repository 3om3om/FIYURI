/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"MM/zba_mmedate/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
