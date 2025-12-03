import "./invoice.scss";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  HeaderFilter,
  LoadPanel,
  Sorting,
  Selection,
  Scrolling,
  Item,
  Toolbar,
  ToolbarItem,
  FilterRow,
  Summary,
  TotalItem,
  Export,
} from "devextreme-react/data-grid";
import { Button, SelectBox } from "devextreme-react";
import DateBox from "devextreme-react/date-box";
import { useEffect, useState } from "react";

import {
  getPartners,
  getInvoices,
  getInvoicesItems,
  getRest,
  loadExcel,
} from "../../../restApi/Api1c";

import { GetStocks, getMarksByUid } from "../../../restApi";
import { formatDate, formatNumber } from "devextreme/localization";
import * as utils from "../utils";

import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { getPayments } from "../../../restApi/Api1c";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { getMarksDiff } from "../../../restApi";
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
const convert = require("xml-js");
const FormatCurrency = "#0.00;(#0.00)";

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export default function Invoice() {
  // const onExporting = (e) => {
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet("Main sheet");

  //   exportDataGrid({
  //     component: e.component,
  //     worksheet,
  //     autoFilterEnabled: true,
  //   }).then(() => {
  //     workbook.xlsx.writeBuffer().then((buffer) => {
  //       // saveAs(
  //       //   new Blob([buffer], { type: "application/octet-stream" }),
  //       //   "DataGrid.xlsx"
  //       // );
  //     });
  //   });
  // };
  const now = new Date();

  const dateLabel = { "aria-label": "Date" };
  function formatDate2(date) {
    //console.log("date.getDate.toDateString()", utils.removeTime(date));
    return formatDate(date, "yyyy-MM-dd");

    // Это Максим нагородил!!!
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц (0-11), добавляем 1 и форматируем
    const day = String(date.getDate()).padStart(2, "0"); // День (1-31)
    const year = date.getFullYear(); // Год (4 цифры)
    return `${day}/${month}/${year}`; // Форматируем строку
  }

  const [partners, setPartners] = useState([]);
  const [shops, setShops] = useState([]);
  console.log(partners);

  useEffect(() => {
    (async function () {
      const p = await getPartners();
      const s = await GetStocks();
      setShops(s);
      setPartners(p);
    })();
  }, []);
  // Пример использования
  // const date = new Date(); // Текущая дата
  // console.log(formatDate(date)); // Вывод: ММ/ДД/ГГГГ
  // const d = new Date();
  // d.setDate(d.getDate() - 30);
  const today = new Date();
  // Вычисляем дату, которая на 7 дней меньше
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [date1, setDate1] = useState(sevenDaysAgo);
  const [date2, setDate2] = useState(new Date());
  const [data, setData] = useState();
  const [partner_uid, setPartnerUID] = useState("");
  const [shopid, setShopid] = useState("");
  const [partner2_uid, setPartner2UID] = useState("");
  const [shop2id, setShop2id] = useState("");
  const date1Change = (e) => {
    // const d = formatDate(e.value);
    setDate1(e.value);
    // console.log(d);
  };
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
  const date2Change = (e) => {
    // const d = formatDate(e.value);
    setDate2(e.value);
    // console.log(e);
  };
  const getType = (type) => {
    if (type === 0) return "приход";
    if (type === 1) return "возврат";
  };
  const execute = async () => {
    const data = await getInvoices({
      date1: formatDate2(date1),
      date2: formatDate2(date2.addDays(1)),
      partner_uid,
      shopid,
    });
    if (data) setData(data.map((el) => ({ ...el, stype: types[el.itype] })));
  };

  const vendorChange = (e) => {
    console.log(e);
    setPartnerUID(e.value);
  };
  const shopChange = (e) => {
    setShopid(e.value);
  };
  const vendor2Change = (e) => {
    console.log(e);
    setPartner2UID(e.value);
  };
  const shop2Change = (e) => {
    setShop2id(e.value);
  };
  const [uid, setUid] = useState("");
  const [code, setCode] = useState("");
  const [curDate, setCurDate] = useState("");
  const [myDate, setMyDate] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [restData, setRestData] = useState([]);
  const [paymentsData, setPaymentsdata] = useState();
  const [isUpload, setIsUpload] = useState();
  const [file, setFile] = useState();
  const [num, setNum] = useState(0);
  const [excelData, setExcelData] = useState([]);
  const [isMarks, setIsMarks] = useState();
  const [marks, setMarks] = useState();
  const chooseInvoice = async (e) => {
    console.log(e);
    setUid(e.data.uid);
    setCode(e.data.code);
    setMyDate(e.data.date);
    setCurDate(formatDate(new Date(e.data.date)));
    setInvoiceItems(await getInvoicesItems({ invoice_uid: e.data.uid }));
  };
  const onselection = (e) => {
    const row = e.selectedRowsData?.[0];
    if (!row) return;
    console.log(e);
    // e = e.selectedRowsData[0];
    setUid(e.selectedRowsData[0].uid);
    setCode(e.selectedRowsData[0].code);
    setMyDate(e.selectedRowsData[0].date);
  };
  const gotoinvoice = async () => {
    setCurDate(formatDate(new Date(myDate), "dd/MM/yyyy"));
    setInvoiceItems(await getInvoicesItems({ invoice_uid: uid }));
  };
  const gotorest = async () => {
    setRestData(await getRest({ taxid: partner_uid }));
  };
  const getDataRest = async () => {
    setRestData(await getRest({ taxid: partner_uid, stock_uid: shop2id }));
  };
  const gotopayments = async () => {
    setPaymentsdata(
      await getPayments({
        date1: formatDate2(date1),
        date2: formatDate2(date2),
        taxid: partner_uid,
      })
    );
  };
  const gotouploads = () => {
    setIsUpload(true);
  };
  const gotomarks = async () => {
    setIsMarks(true);
    setMarks(await getMarksByUid(uid));
  };
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleUploadClick = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("num", num);
    try {
      const response = await loadExcel(formData);

      // const jsonResult = convert.xml2json(response);

      // setExcelData(jsonResult.pricelist.row);
      const parser = new XMLParser();
      const jsonObj = parser.parse(response);
      setExcelData(jsonObj.pricelist.row);
      console.log(jsonObj);
    } catch (err) {
      console.log(err);
    }
  };
  const [product_uid, setCurProductuid] = useState();
  const [marksDiff, setMarksDiff] = useState();
  const gotoMarksDiff = async () => {
    if (product_uid) {
      setMarksDiff(await getMarksDiff(product_uid));
      // setStatus("marksDiff");
    }
  };

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
      <h2 style={{ marginLeft: "30px" }}>1C</h2>
      {/* {isUpload && (
        <>
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                setIsUpload(false);
                // setData();
              }}
            />{" "}
          </div>
          <input type="file" onChange={handleFileChange} />
          <div>{file && `${file.name} - ${file.type}`}</div>
          <div style={{ width: "100px" }}>
            <SelectBox
              items={[0, 1, 2, 3, 4]}
              onValueChanged={(e) => setNum(e.value)}
              defaultValue={0}
            />{" "}
          </div>
          <Button text="Отправить" onClick={handleUploadClick} />
          <DataGrid 
            dataSource={excelData}          
            //keyExpr={"idx"}   
            columnAutoWidth={true}
            allowColumnResizing={true}
 />
        </>
      )} */}

      {paymentsData?.length > 0 && (
        <>
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                setPaymentsdata([]);
                // setData();
              }}
            />{" "}
          </div>
          <DataGrid dataSource={paymentsData}>
            <Column
              dataField="date"
              format="dd/MM/yyyy"
              dataType="date"
              caption="Дата"
            />
            <Column dataField="num" caption="Номер" />
            <Column dataField="info" caption="Инфо" />
          </DataGrid>{" "}
        </>
      )}
      {restData?.length > 0 && (
        <>
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                setRestData([]);
                // setData();
              }}
            />{" "}
          </div>
          <DataGrid
            dataSource={restData}
            keyExpr={"product_uid"}
            columnAutoWidth={true}
            allowColumnResizing={true}
            allowColumnReordering={true}
            showBorders={true}
            showColumnLines={true}
            showRowLines={true}
            height={"100%"}
            onExporting={onExporting}
          >
            <SearchPanel visible={true} width={340} placeholder="Поиск ..." />
            <Sorting mode="single" />
            <Selection mode="single" />
            <FilterRow visible={true} />
            <LoadPanel enabled={true} />
            <Paging enabled={true} />
            <Column caption="Дата">
              <Column
                dataField="min_date"
                dataType="date"
                format="dd/MM/yyyy"
                caption="Первая"
              />
              <Column
                dataField="max_date"
                dataType="date"
                format="dd/MM/yyyy"
                caption="Последняя"
              />
              <Column
                dataField="stop_days"
                dataType="number"
                caption="без движения"
                width={"100px"}
              />
            </Column>
            <Column caption="Количество товара">
              <Column
                dataField="quant_rest"
                caption="Остатки"
                dataType="number"
              />
              <Column
                dataField="quant_sale"
                caption="Продано"
                dataType="number"
              />
            </Column>

            <Column caption="Цены">
              <Column
                dataField="price"
                caption="Закупочные"
                dataType="number"
                format={FormatCurrency}
              />
              <Column
                dataField="price_sad"
                caption="Садовая"
                dataType="number"
                format={FormatCurrency}
              />
              <Column
                dataField="price_var"
                caption="Варшавка"
                dataType="number"
                format={FormatCurrency}
              />
            </Column>
            <Column caption="Номенклатура">
              <Column dataField="name" caption="Название" />
              <Column dataField="code" caption="Код" />
              <Column dataField="group_name" caption="Название группы" />
            </Column>
            <Toolbar>
              <Item location="before" name="searchPanel" locateInMenu="auto" />
              <Item location="before">
                <SelectBox
                  placeholder="Выберите поставщика"
                  dataSource={partners}
                  displayExpr="upper"
                  defaultValue={partner_uid}
                  searchEnabled={true}
                  searchMode={"contains"}
                  width={"600px"}
                  onValueChanged={vendor2Change}
                  showClearButton={true}
                  // inputAttr={templatedProductLabel}
                  valueExpr="taxid"
                  // defaultValue={partners[0].uid}
                />
              </Item>
              <Item location="before">
                <SelectBox
                  placeholder="Выберите магазин"
                  dataSource={shops}
                  displayExpr="name"
                  defaultValue={shopid}
                  searchEnabled={true}
                  searchMode={"contains"}
                  width={"300px"}
                  onValueChanged={shop2Change}
                  showClearButton={true}
                  // inputAttr={templatedProductLabel}
                  valueExpr="id"
                  // defaultValue={partners[0].uid}
                />
              </Item>
              <Item location="before">
                <Button text="OK" onClick={getDataRest} />
              </Item>
            </Toolbar>
            {/* <Column dataField="" caption="" /> */}
            <Export enabled={true} allowExportSelectedData={true} />
          </DataGrid>
        </>
      )}
      {invoiceItems?.length > 0 &&
        (marksDiff?.length === 0 || marksDiff === undefined) && (
          <>
            <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
              <Button
                icon="back"
                id="icon-disabled-back"
                onClick={() => {
                  setInvoiceItems([]);
                  // setData();
                }}
              />{" "}
              Код: {code} Дата: {curDate}
            </div>
            <DataGrid
              dataSource={invoiceItems}
              // keyExpr={"uid"}
              onSelectionChanged={(e) => {
                setCurProductuid(e.currentSelectedRowKeys[0].product_uid);
                console.log(e);
              }}
            >
              <Selection mode="single" />
              <Column dataField="code" caption="Код" />
              <Column dataField="origname" caption="Название" />
              <Column dataField="categ_name" caption="Группа" />
              <Column dataField="quant" caption="Количество" />
              <Column
                dataField="price"
                format={FormatCurrency}
                caption="Цена"
              />
              <Column dataField="sum" format={FormatCurrency} caption="Сумма" />
              <Column caption="Остатки по накладной">
                <Column dataField="quant_rest" caption="Остаток товара" />
                <Column dataField="quant_use" caption="Продано товара" />
              </Column>
              <Summary>
                <TotalItem
                  column="quant"
                  summaryType="sum"
                  customizeText={(itemInfo) => `${itemInfo.value}`}
                />
                <TotalItem
                  column="sum"
                  summaryType="sum"
                  customizeText={(itemInfo) =>
                    `${formatNumber(itemInfo.value, "#0.00")}`
                  }
                />
                <TotalItem
                  column="quant_rest"
                  summaryType="sum"
                  customizeText={(itemInfo) => `${itemInfo.value}`}
                />
                <TotalItem
                  column="quant_use"
                  summaryType="sum"
                  customizeText={(itemInfo) => `${itemInfo.value}`}
                />
              </Summary>
              <Toolbar>
                <Item location="before">
                  <Button
                    text="Марки"
                    disabled={!product_uid}
                    onClick={gotoMarksDiff}
                  />
                </Item>
              </Toolbar>
            </DataGrid>
          </>
        )}
      {marksDiff?.length > 0 && (
        <>
          <Button
            icon="back"
            id="icon-disabled-back"
            onClick={() => {
              setMarksDiff([]);
              // setData();
            }}
          />
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
      {!(invoiceItems?.length > 0) &&
        !(restData?.length > 0) &&
        !(paymentsData?.length > 0) &&
        !isUpload &&
        !isMarks && (
          <DataGrid
            className="grid"
            dataSource={data}
            // keyExpr={"uid"}
            columnAutoWidth={true}
            onRowDblClick={gotoinvoice}
            allowColumnResizing={true}
            allowColumnReordering={true}
            onSelectionChanged={onselection}
            showBorders={true}
            showColumnLines={true}
            showRowLines={true}
            height={"100%"}
            width={"auto"}
          >
            <Sorting mode="single" />
            <Selection mode="single" />
            <LoadPanel enabled={true} />
            <Paging enabled={true} />

            <Column
              dataField="date"
              format="dd/MM/yyyy"
              dataType="date"
              caption="Дата"
            />
            <Column
              dataField="num"
              caption="Номер накладной"
              dataType="string"
              width={"120px"}
            />
            <Column
              dataField="stype"
              caption="Тип"
              dataType="string"
              width={"100px"}
            />
            <Column
              dataField="sum_total"
              caption="Сумма"
              dataType="number"
              format={FormatCurrency}
            />
            <Column caption="Поставщик">
              <Column dataField="name" caption="Название поставщика" />
              <Column
                dataField="group_unit"
                caption="Группа товарного обеспечения"
              />
              <Column dataField="code" caption="Код" />
            </Column>
            <Column caption="Магазин/Склад">
              <Column dataField="stock_name" caption="Название" />
              <Column dataField="stock_code" caption="Код" />
            </Column>

            <Toolbar>
              <Item location="before">
                <SelectBox
                  placeholder="Выберите поставщика"
                  dataSource={partners}
                  displayExpr="upper"
                  defaultValue={partner_uid}
                  searchEnabled={true}
                  searchMode={"contains"}
                  width={"600px"}
                  onValueChanged={vendorChange}
                  showClearButton={true}
                  // inputAttr={templatedProductLabel}
                  valueExpr="taxid"
                  // defaultValue={partners[0].uid}
                />
              </Item>
              <Item location="before">
                <SelectBox
                  placeholder="Выберите магазин"
                  dataSource={shops}
                  displayExpr="name"
                  defaultValue={shopid}
                  searchEnabled={true}
                  searchMode={"contains"}
                  width={"300px"}
                  onValueChanged={shopChange}
                  showClearButton={true}
                  // inputAttr={templatedProductLabel}
                  valueExpr="id"
                  // defaultValue={partners[0].uid}
                />
              </Item>
              <Item location="before">
                <DateBox
                  onValueChanged={date1Change}
                  defaultValue={date1}
                  displayFormat="dd/MM/yyyy"
                  inputAttr={dateLabel}
                  type="date"
                  // displayFormat="shortdate"
                  useMaskBehavior="true"
                />
              </Item>
              <Item location="before">
                <DateBox
                  onValueChanged={date2Change}
                  defaultValue={date2}
                  displayFormat="dd/MM/yyyy"
                  inputAttr={dateLabel}
                  type="date"
                  // displayFormat="shortdate"
                  useMaskBehavior="true"
                />
              </Item>

              <Item location="before">
                <Button text="OK" onClick={execute} />
              </Item>

              <Item location="before">
                <div className="toolbar-separator"></div>
              </Item>

              <Item location="before">
                <Button
                  text="Содержимое"
                  disabled={!uid}
                  onClick={gotoinvoice}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Остатки"
                  disabled={!partner_uid}
                  onClick={gotorest}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Платежи"
                  // disabled={!partner_uid}
                  onClick={gotopayments}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Загрузка"
                  // disabled={!partner_uid}
                  onClick={gotouploads}
                />
              </Item>
              <Item location="before">
                <Button
                  text="Марки"
                  // disabled={!partner_uid}
                  onClick={gotomarks}
                />
              </Item>
            </Toolbar>
          </DataGrid>
        )}
      {isMarks && (
        <>
          <Button
            icon="back"
            id="icon-disabled-back"
            onClick={() => {
              setIsMarks(false);
              // setData();
            }}
          />

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
