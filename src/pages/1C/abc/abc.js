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
import { Button, SelectBox } from "devextreme-react";
import DateBox from "devextreme-react/date-box";
import { formatDate } from "devextreme/localization";
import { Workbook } from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import saveAs from "file-saver";
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
import { useEffect, useState, useRef } from "react";
import { getAbc } from "../../../restApi/Api1c";
export default function Abc() {
  const [data, setData] = useState([]);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [shopid, setShopid] = useState();
  const [shops, setShops] = useState();
  const [uid, setUid] = useState();
  const [groupid, setGroupid] = useState();
  const [groups, setGroups] = useState();
  //   useEffect(() => {
  //     (async function () {
  //       setShops(await GetStocks());
  //     })();
  //   }, []);

  const shopChange = (e) => {
    console.log(e);
    setShopid(e.value);
  };

  const date1Change = (e) => {
    console.log("date1Change=", e.value);
    setDate1(e.value);
  };
  const date2Change = (e) => {
    console.log("date2Change=", e.value.toDateString());
    setDate2(e.value);
  };
  const getData = async () => {
    setData(
      await getAbc({
        date1: formatDate(date1, "yyyy-MM-dd"),
        date2: formatDate(date2, "yyyy-MM-dd"),
      })
    );
  };
  // const onExporting = (e) => {
  //   console.log("START");
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet("Main sheet");
  //   exportDataGrid({
  //     component: e.component,
  //     worksheet: worksheet,
  //     customizeCell: function (options) {
  //       options.excelCell.font = { name: "Arial", size: 12 };
  //       options.excelCell.alignment = { horizontal: "left" };
  //     },
  //   }).then(function () {
  //     workbook.xlsx.writeBuffer().then(function (buffer) {
  //       saveAs(
  //         new Blob([buffer], { type: "application/octet-stream" }),
  //         "DataGrid.xlsx"
  //       );
  //     });
  //   });
  // };
  // function exportGrid() {
  //   const doc = new jsPDF();
  //   // const dataGrid = dataGridRef.current.instance();
  //   exportDataGridToPdf({
  //     jsPDFDocument: doc,
  //     component: data,
  //   }).then(() => {
  //     doc.save("DataGrid.pdf");
  //   });
  // }
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
  const dataGridRef = useRef(null);
  return (
    <>
      <DataGrid
        // ref={dataGridRef}
        dataSource={data}
        allowColumnResizing={true}
        allowColumnReordering={true}
        columnAutoWidth={true}
        showBorders={true}
        columnResizingMode={"widget"}
        onExporting={onExporting}
      >
        <Export enabled={true} formats={exportFormats} />
        <Selection mode="single" />
        <Column dataField="groupname" caption="Группа" />
        <Column dataField="origname" caption="Название" />
        <Column dataField="quant" caption="Количество" />
        <Column dataField="sum" caption="Сумма" />
        <Column dataField="status_sum" caption="Статус суммы" />
        <Column dataField="status_quant" caption="Статус количества" />
        {/* {fData && getColumns(fData).map((col) => <Column dataField={col} />)} */}
        {/* <Column dataField="code" caption="Код" />
      <Column dataField="origname" caption="Название" />
      <Column dataField="to_char" caption="to_char" />
      <Column dataField="quant" caption="Количество" /> */}
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
          {/* <Item location="before">
            <Button
              disabled={!!!data}
              text="Export to excel"
              onClick={exportToExcel}
            />
          </Item> */}
          <Item name="exportButton" locateInMenu="auto" location="before" />
          {/* <Item location="before">
            <SelectBox
              items={["pdf", "excel"]}
              defaultValue={"pdf"}
              onValueChanged={(e) => setExportVal(e.value)}
            />
            {/* <Button text="Export to pdf" onClick={exportGrid} /> */}
          {/* </Item> */} */}
          {/* <Item location="before">
            <Button text="Export" onClick={exportFunc} />
          </Item> */}
          <Item location="before">
            <Button text="ОК" onClick={getData} />
          </Item>
        </Toolbar>
      </DataGrid>
    </>
  );
}
