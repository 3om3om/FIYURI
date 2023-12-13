sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    // "sap/ui/core/date/UI5Date",
    "sap/ui/unified/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    // UI5Date,
    unifiedLibrary,
    Filter,
    FilterOperator,
    Fragment
  ) {
    "use strict";

    // var CalendarDayType = unifiedLibrary.CalendarDayType;

    return Controller.extend("MM.zbammedate.controller.Main", {
      // DateFormatter: function (oDate) {
      //   // 바인딩된 값이 oDate로 넣어짐
      //   return UI5Date.getInstance(oDate); // 바인딩된 값을 UI5Date 형식으로 변환 후 리턴
      // },

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
        this.getOwnerComponent().getModel().setSizeLimit(99999);

        var oDatas = {
          list1: [{ MTART: "원자재" }, { MTART: "부자재" }],
          list2: [
            { BWART: "001 : 원자재 미입고" },
            { BWART: "101 : 원자재 입고" },
          ],
          list3: [
            { MATNR: "MT0001 : 판유리" },
            { MATNR: "MT0002 : PVB 필름" },
            { MATNR: "MT0003 : 금속판" },
            { MATNR: "MT0004 : 비닐" },
          ],
        };

        // json data를 포함한 json model 생성
        var oModel = new JSONModel(oDatas);

        // json model을 뷰에서 사용할 수 있도록 생성 ("view"는 모델 이름)
        this.getView().setModel(oModel, "view");
      },

      onAfterRendering: function () {
        var oCalendar = this.byId("SPC1");
        var oCombobox1 = this.byId("idCombobox1").getValue();
        var oCombobox2 = this.byId("idCombobox2").getValue();
        var oCombobox3 = this.byId("idCombobox3").getValue();
        var aFilter = []; // undefined

        if (oCombobox1) {
          aFilter.push(
            new Filter({
              path: "MTART",
              operator: "EQ",
              value1: oCombobox1,
            })
          );
        }

        if (oCombobox2) {
          aFilter.push(
            new Filter({
              path: "BWART",
              operator: "EQ",
              value1: oCombobox2,
            })
          );
        }

        if (oCombobox3) {
          aFilter.push(
            new Filter({
              path: "MATNR",
              operator: "EQ",
              value1: oCombobox3,
            })
          );
        }

        oCalendar
          .getBinding("appointments")
          .filter((aFilter.length && aFilter) || undefined);
      },

      onSearch: function () {
        var oCalendar = this.byId("SPC1");
        var oCombobox1 = this.byId("idCombobox1").getValue();
        var oCombobox2 = this.byId("idCombobox2").getValue();
        var oCombobox3 = this.byId("idCombobox3").getValue();
        var aFilter = []; // undefined

        if (oCombobox1) {
          aFilter.push(
            new Filter({
              path: "MTART",
              operator: "EQ",
              value1: oCombobox1,
            })
          );
        }

        if (oCombobox2) {
          aFilter.push(
            new Filter({
              path: "BWART",
              operator: "EQ",
              value1: oCombobox2,
            })
          );
        }

        if (oCombobox3) {
          aFilter.push(
            new Filter({
              path: "MATNR",
              operator: "EQ",
              value1: oCombobox3,
            })
          );
        }

        oCalendar
          .getBinding("appointments")
          .filter((aFilter.length && aFilter) || undefined);
      },

      onbeforeDialog: function (oEvent) {
        // var sPath = oEvent.mParameters.appointment.mProperties.title;
        // var sPath = oEvent.getSource().mBindingInfos.appointments;
        // var sPath = oEvent.getParameters().appointment._getBindingContext().getProperty().EBELN; // '32000006'
        var sPath = oEvent
          .getParameters()
          .appointment.getBindingContext().sDeepPath; // "/ZBA_MMT100Set('32000006')" 형태
        debugger;
        this.getView()
          .getModel()
          .read(sPath, {
            success: function (oReturn) {
              return this.onDialog(oReturn);
            }.bind(this),
          });
      },

      onDialog: function (oReturn) {
        var oDialog = sap.ui.getCore().byId("idDialog");
        var jModel = new JSONModel([oReturn]);
        // ODataModel.getProperty(경로) 해서 해당 Row의 전체 데이터 가져오기
        // => 전체데이터.OrderID를 통해 OrderID 값을 얻을 수 있다.
        // var oItem = oModel.getProperty(sPath);
        // var oItem = oModel.getKey(sPath);

        if (oDialog) {
          sap.ui.getCore().byId("idPOList").setModel(jModel);
          oDialog.open();
        } else {
          Fragment.load({
            name: "MM.zbammedate.view.Fragment.Detail",
            type: "XML",
            controller: this,
          }).then(function (oDialog) {
            sap.ui.getCore().byId("idPOList").setModel(jModel);
            oDialog.open();
          });
        }
      },

      onmoreLinkPress: function (oEvent) {
        var oKey = this.byId("SPC1");
        var oDateRange = this.byId("SPC1");
        var oCombobox2 = this.byId("idCombobox2").getValue();
        var oDate = oEvent.getParameter("date");
        oDate.setDate(oDate.getDate() + 1);
        // var oDate = oEvent.getParameters().date;
        // var oDate1 = this.formatter.fnDateString(oDate).slice(0, 4);
        // var oDate2 = this.formatter.fnDateString(oDate).slice(5, 7);
        // var oDate3 = this.formatter.fnDateString(oDate).slice(8, 10);
        console.log(oDate);

        // var bindItem = this.byId("idPOList2").getBinding();

        var aFilter = [];

        if (oCombobox2) {
          aFilter.push(
            new Filter({
              path: "BWART",
              operator: "EQ",
              value1: oCombobox2,
            })
          );
        }

        if (oDate) {
          aFilter.push(
            new Filter({
              path: "DDATE",
              operator: "EQ",
              value1: oDate,
              //value1: oDateRange.getStartDate(),
              // value2: oDateRange.getSecondDateValue(),
            })
          );
          // bindItem.filter(aFilter);
        }
        this.getView()
          .getModel()
          .read("/ZBA_MMT100Set", {
            filters: aFilter,
            success: function (oReturn) {
              console.log(oReturn);
              return this.onmoreDialog(oReturn);
            }.bind(this),
          });
      },

      onmoreDialog: function (oReturn) {
        var oDialog = sap.ui.getCore().byId("idMoreDialog");
        var jModel = new JSONModel(oReturn);
        // ODataModel.getProperty(경로) 해서 해당 Row의 전체 데이터 가져오기
        // => 전체데이터.OrderID를 통해 OrderID 값을 얻을 수 있다.
        // var oItem = oModel.getProperty(sPath);
        // var oItem = oModel.getKey(sPath);

        if (oDialog) {
          sap.ui.getCore().byId("idPOList2").setModel(jModel);
          oDialog.open();
        } else {
          Fragment.load({
            name: "MM.zbammedate.view.Fragment.More",
            type: "XML",
            controller: this,
          }).then(function (oDialog) {
            sap.ui.getCore().byId("idPOList2").setModel(jModel);
            oDialog.open();
          });
        }
        debugger;
      },

      onClose: function (oEvent) {
        /*
            getSource() : 이벤트를 일으킨 객체
            getParameters() : 이벤트 관련 정보 
        */
        // var oDialog = sap.ui.getcore().byId("idDialog");
        var oButton = oEvent.getSource();
        var oDialog = oButton.getParent();

        oDialog.close();
      },
    });
  }
);
