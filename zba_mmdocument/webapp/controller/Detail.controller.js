sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("MM.zbammdocument.controller.Detail", {
      formatter2: {
        fnNumberString: function (oString) {
          if (oString) {
            var oDateTimeInstance =
              sap.ui.core.format.NumberFormat.getIntegerInstance({
                groupingEnabled: true,
                groupingSeparator: ",",
                groupingSize: 3,
              });

            return oDateTimeInstance.format(oString);
          }
        },
      },

      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("RouteDetail")
          .attachPatternMatched(this._patternMatched, this);
        //RouteDetail를 가져와 패턴이 일치할 때 함수를 실행하겠다
      },

      _patternMatched: function (oEvent) {
        var oParam = oEvent.getParameters().arguments;

        this.getView().bindElement(`/ZBA_MMT110Set(${oParam.paramID})`);

        var oModel = this.getView().getModel();
        var sPath = oModel.createKey("/ZBA_MMT110Set", {
          MBLNR: oParam.paramID,
        });

        oModel.read(sPath, {
          urlParameters: {
            $expand: "ZBA_MMT120Set",
          },
          success: function (oReturn) {
            var detail = new JSONModel(oReturn.ZBA_MMT120Set);
            this.byId("idDocumentItemList").setModel(detail);
          }.bind(this),
          error: function (oError) {},
        });

        debugger;
      },

      onNavMain: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteMain"); //화면 이동시 route 이름 ("RouteMain")으로 감
      },
    });
  }
);
