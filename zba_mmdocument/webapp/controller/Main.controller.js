sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Fragment, Filter, FilterOperator, JSONModel) {
    "use strict";

    return Controller.extend("MM.zbammdocument.controller.Main", {
      //formatter 객체 안에다 format function들을 넣고 관리
      formatter: {
        //fnDateString => 날짜 객체를 'yyyy-MM-dd' 형태로 변경
        fnDateString: function (oDate) {
          if (oDate) {
            var oDateTimeInstance =
              sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd",
              });

            return oDateTimeInstance.format(oDate);
          }
        },
      },

      onInit: function () {
        var oDatas = {
          list: [
            { BWART: "101 : 원자재 입고 (벤더 -> 창고)" },
            { BWART: "201 : 원자재 출고 (창고 -> 공장)" },
            { BWART: "301 : 완제품 입고 (공장 -> 창고)" },
            { BWART: "401 : 완제품 출고 (창고 -> 고객)" },
          ],
        };
        // json data를 포함한 json model 생성
        var oModel = new JSONModel(oDatas);
        // json model을 뷰에서 사용할 수 있도록 생성 ("view"는 모델 이름)
        this.getView().setModel(oModel, "view");
      },

      onSelectionChange: function (oEvent) {
        var sPath = oEvent.getParameters().listItem.getBindingContextPath();
        var oModel = this.getView().getModel();

        // ODataModel.getProperty(경로) 해서 해당 Row의 전체 데이터 가져오기
        // => 전체데이터.OrderID를 통해 OrderID 값을 얻을 수 있다.
        var oItem = oModel.getProperty(sPath);

        // Detail 화면으로 이동
        // => 이동 시, 해당 OrderID를 필수 파라미터로 포함
        debugger;
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteDetail", {
          paramID: oItem.MBLNR,
        });

        // <테스트 방법>
        // Detail 라우터의 URl에 OrderID 값이 잘 들어오는지 확인
      },

      onClose: function (oEvent) {
        oEvent.getSource().getParent().close();
      },

      onValueHelp1: function () {
        if (sap.ui.getCore().byId("idDialog1")) {
          sap.ui.getCore().byId("idDialog1").open();
        } else {
          Fragment.load({
            name: "MM.zbammdocument.view.Fragment.Mblnr",
            type: "XML",
            controller: this,
            // 팝업 안에서 이벤트 처리를 하려면 함수의 컨트롤러를 넘겨줘야함
            //fragment에 this를 넘겨준다.
          }).then(
            function (oDialog) {
              oDialog.setModel(this.getView().getModel()); // Core에 setModel.
              oDialog.open();
            }.bind(this)
          );
        }
      },

      onRowChange1: function (oEvent) {
        var getId = this.getView()
          .getModel()
          .getProperty(
            "/" +
              oEvent.getSource().getBinding("rows").aKeys[
                oEvent.getParameters().rowIndices
              ]
          ).MBLNR;
        this.byId("idInput1").setValue(getId);
        sap.ui.getCore().byId("idDialog1").close();
      },

      onSearch: function () {
        var inputNm = this.byId("idInput1").getValue();
        var oCombobox = this.byId("idCombobox").getValue();
        var oDateRange = this.byId("idInput3");
        var bindItem = this.byId("idDocumentList").getBinding("items");

        var aFilter = [];

        if (inputNm) {
          aFilter.push(
            new Filter({
              path: "MBLNR",
              operator: "EQ",
              value1: inputNm,
            })
          );
        }

        if (oCombobox) {
          aFilter.push(
            new Filter({
              path: "BWART",
              operator: "EQ",
              value1: oCombobox,
            })
          );
        }

        if (oDateRange.getDateValue() && oDateRange.getSecondDateValue()) {
          aFilter.push(
            new Filter({
              path: "CDATE",
              operator: "BT",
              value1: oDateRange.getDateValue(),
              value2: oDateRange.getSecondDateValue(),
            })
          );
          debugger;
        }

        bindItem.filter(aFilter);
        // bindItem.filter((aFilter.length && aFilter) || undefined);
      },
    });
  }
);
