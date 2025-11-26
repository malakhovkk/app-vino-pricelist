import DataGrid, {
  Column,
  Sorting,
  Selection,
  Scrolling,
  Item,
  Toolbar,
  ToolbarItem,
  Export,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import DateBox from "devextreme-react/date-box";
import { useEffect, useState } from "react";

import { getInv, getContent } from "../../../restApi/Api1c";
import * as utils from "../utils";

import "../1c.scss";

import { Col } from "devextreme-react/cjs/responsive-box";
import { formatDate } from "devextreme/localization";
import { getMarksByUid } from "../../../restApi";
import { getMarksDiff } from "../../../restApi";

import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
export default function Revenue() {
  const FormatCurrency = "#0.00;(#0.00)";

  const DaysAgo2 = new Date();
  DaysAgo2.setDate(DaysAgo2.getDate() - 2);

  const [data, setData] = useState();
  const [date1, setDate1] = useState(DaysAgo2);
  const [date2, setDate2] = useState(new Date());

  const date1Change = (e) => {
    console.log("date1Change=", e.value);
    setDate1(e.value);
  };
  const date2Change = (e) => {
    console.log("date2Change=", e.value.toDateString());
    setDate2(utils.removeTime(e.value));
  };
  function formatDate2(date) {
    //const date2 = utils.removeTime(date);
    //console.log('formatDate=', date, 'locale=', date2.toLocaleString(), 'iso=', date2.toISOString(), 'format=', formatDate(date, 'yyyy-MM-dd'))
    return formatDate(date, "yyyy-MM-dd");
    // Это Максим нагородил!!!
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц (0-11), добавляем 1 и форматируем
    const day = String(date.getDate()).padStart(2, "0"); // День (1-31)
    const year = date.getFullYear(); // Год (4 цифры)

    return `${day}/${month}/${year}`; // Форматируем строку
  }
  //   useEffect(() => {
  //     (async function () {
  //       setData(
  //         await getInv({ date1: formatDate(date1), date2: formatDate(date2) })
  //       );
  //     })();
  //   }, []);
  const getDatafunc = async () => {
    setData(
      await getInv({
        date1: formatDate2(date1),
        date2: formatDate2(date2.addDays(1)),
      })
    );
  };
  const [uid, setUid] = useState("");
  const [marks, setMarks] = useState();
  const [product_uid, setCurProductuid] = useState();
  const [marksDiff, setMarksDiff] = useState([]);
  const [status, setStatus] = useState("");
  const types = {
    0: "ПриобретениеТоваровУслуг",
    1: "ВозвратТоваровПоставщику",
    2: "РеализацияТоваровУслуг",
    3: "ОтчетОРозничныхПродажах",
    4: "ОтчетОРозничныхВозвратах",
    5: "Пересортица",
    6: "Излишки",
    7: "ПеремещениеТоваров",
  };
  const onSelected = (e) => {
    console.log(e);
    setUid(e.selectedRowsData[0].uid);
  };
  const [content, setContent] = useState([]);
  const showContent = async () => {
    setContent(await getContent({ uid }));
    setStatus("content");
  };
  const showMarks = async () => {
    setMarks(await getMarksByUid(uid));
    setStatus("marks");
  };
  const getMarks = async () => {
    if (product_uid) {
      setMarksDiff(await getMarksDiff(product_uid));
      setStatus("marksDiff");
    }
  };
  console.log(marks, marksDiff, content);
  const saveAsPdf = (e) => {
    const doc = new jsPDF();
    // const workbook = new Workbook();
    // const worksheet = workbook.addWorksheet("Main sheet");
    // const dataGrid = dataGridRef.current.instance;
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: e.component,
      indent: 5,
      topLeft: { x: 10, y: 10 },
      columnWidths: [30, 30, 30, 30],

      onRowExporting: (e) => {
        // обработка строк перед экспортом
      },
    }).then(() => {
      // workbook.xlsx.writeBuffer().then((buffer) => {
      doc.save("DataGrid.pdf");
      // });
    });
  };

  const saveAsExcel = (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Main sheet");
    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      customizeCell: function (options) {
        options.excelCell.font = { name: "Arial", size: 12 };
        options.excelCell.alignment = { horizontal: "left" };
      },
    }).then(function () {
      workbook.xlsx.writeBuffer().then(function (buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "DataGrid.xlsx"
        );
      });
    });
  };
  const onExporting = (e) => {
    console.log(e);
    if (e.format === "pdf") {
      saveAsPdf(e);
    } else {
      saveAsExcel(e);
    }
  };
  const [exportVal, setExportVal] = useState("pdf");
  const exportFormats = ["pdf", "xlsx"];
  return (
    <>
      <h2>Выручка</h2>
      {status === "content" && (
        <>
          {" "}
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                setStatus("");
                // setData();
              }}
            />{" "}
          </div>
          <DataGrid
            dataSource={content}
            columnAutoWidth={true}
            allowColumnResizing={true}
            allowColumnReordering={true}
            onSelectionChanged={(e) =>
              setCurProductuid(e.currentSelectedRowKeys[0].product_uid)
            }
            width={"100%"}
            showRowLines={true}
            showBorders={true}
            showColumnLines={true}
            height={"100%"}
          >
            <Selection mode="single" />
            <Toolbar>
              <Item location="before">
                <Button
                  text="Марки"
                  disabled={!product_uid}
                  onClick={getMarks}
                />
              </Item>
            </Toolbar>
            <Column caption="Продажа">
              <Column dataField="code" caption="Код номенклатуры" />
              <Column dataField="origname" caption="Название номенклатуры" />
              <Column
                dataField="group_unit"
                caption="Группа товарного обеспечения"
              />
              <Column
                dataField="price_sale"
                format={FormatCurrency}
                caption="Цена продажи"
              />
              <Column dataField="quant" caption="Количество" />
              <Column
                dataField="sum_sale"
                format={FormatCurrency}
                caption="Сумма продажи"
              />
            </Column>
            <Column caption="Приходная накладная">
              <Column
                dataField="price_get"
                dataType="number"
                format={FormatCurrency}
                caption="Цена поступления"
              />
              <Column
                dataField="date"
                caption="Дата"
                dataType="date"
                format="dd/MM/yyyy"
              />
              <Column dataField="num" caption="Номер" />
              <Column dataField="partner_code" caption="Код поставщика" />
              <Column dataField="partner_name" caption="Название поставщика" />
            </Column>
          </DataGrid>
        </>
      )}
      {status === "marksDiff" && (
        <>
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                setStatus("content");
                // setData();
              }}
            />{" "}
          </div>

          <DataGrid
            dataSource={marksDiff.map((el) => ({
              ...el,
              itype: types[el.itype],
            }))}
          >
            <Column dataField="num" caption="Номер" />
            <Column
              dataField="date"
              caption="Дата"
              dataType="date"
              formatDate="dd/mm/yyyy"
            />
            <Column dataField="itype" caption="ИТип" />
            <Column dataField="stype" caption="СТип" />
            <Column dataField="code" caption="Код" />
          </DataGrid>
        </>
      )}
      {status === "" && (
        <>
          {/* <div style={{ display: "inline-block", marginRight: "10px" }}>
            <DateBox
              onValueChanged={date1Change}
              defaultValue={date1}
              displayFormat="dd/MM/yyyy"
              // inputAttr={dateLabel}
              type="date"
              width={300}
              // displayFormat="shortdate"
              useMaskBehavior="true"
            />
          </div>
          <div style={{ display: "inline-block" }}>
            <DateBox
              onValueChanged={date2Change}
              defaultValue={date2}
              displayFormat="dd/MM/yyyy"
              width={300}
              // inputAttr={dateLabel}
              type="date"
              // displayFormat="shortdate"
              useMaskBehavior="true"
            />
          </div>
          <div style={{ display: "inline-block" }}>
            <Button text="ОК" onClick={getDatafunc} />
          </div> */}
          <DataGrid
            dataSource={data}
            onSelectionChanged={onSelected}
            onRowDblClick={showContent}
            keyExpr={"uid"}
            columnAutoWidth={true}
            allowColumnResizing={true}
            allowColumnReordering={true}
            width={"100%"}
            showRowLines={true}
            showBorders={true}
            showColumnLines={true}
          >
            <Selection mode="single" />
            <Column caption="Выручка">
              <Column
                dataField="date"
                caption="Дата"
                dataType="date"
                format={"dd/MM/yyyy"}
              />
              <Column dataField="sum" format={FormatCurrency} caption="Сумма" />
              <Column dataField="num" caption="Номер отчета" />
            </Column>
            <Column caption="Магазин/склад">
              <Column dataField="stock_name" caption="Название" />
              <Column dataField="stock_code" caption="Код" />
            </Column>
            <Toolbar>
              <Item location="before">
                <DateBox
                  onValueChanged={date1Change}
                  defaultValue={date1}
                  displayFormat="dd/MM/yyyy"
                  // inputAttr={dateLabel}
                  type="date"
                  width={300}
                  // displayFormat="shortdate"
                  useMaskBehavior="true"
                />
              </Item>
              <Item location="before">
                <DateBox
                  onValueChanged={date2Change}
                  defaultValue={date2}
                  displayFormat="dd/MM/yyyy"
                  width={300}
                  // inputAttr={dateLabel}
                  type="date"
                  // displayFormat="shortdate"
                  useMaskBehavior="true"
                />
              </Item>
              <Item location="before">
                <Button text="ОК" onClick={getDatafunc} />
              </Item>
              <Item location="before">
                <Button
                  text="Содержимое"
                  disabled={!uid}
                  onClick={showContent}
                />
              </Item>
              <Item location="before">
                <Button text="Марки" disabled={!uid} onClick={showMarks} />
              </Item>
            </Toolbar>
          </DataGrid>
        </>
      )}
      {status === "marks" && (
        <>
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                setStatus("");
                // setData();
              }}
            />{" "}
          </div>
          <DataGrid dataSource={marks} onExporting={onExporting}>
            <Export
              enabled={true}
              formats={exportFormats}
              allowExportSelectedData={true}
            />
            <Selection mode="multiple" />
            <Column dataField="pcode" caption="Код товара" />
            <Column dataField="code" caption="Код" />
            <Column dataField="stype" caption="Тип" />
            <Column dataField="origname" caption="Название" />
          </DataGrid>
        </>
      )}
    </>
  );
}
