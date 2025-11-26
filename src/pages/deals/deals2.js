import DataGrid, {
  Column,
  HeaderFilter,
  MasterDetail,
  Selection,
  Toolbar,
  Item,
  SearchPanel,
  Paging,
} from "devextreme-react/data-grid";

import {
  getDeals,
  setStatusDeal,
  getDealItem,
  updateDealExtraInfo,
  getRemainingProducts,
} from "../../api/auth";
import Button from "devextreme-react/button";

import React, { useRef, useState, useEffect, useCallback } from "react";

import "./deals.css";

//import { BackgroundColor } from "devextreme-react/cjs/chart.js";

//import "devextreme/dist/css/dx.material.blue.light.css";
import "devextreme/dist/css/dx.material.purple.light.css";
//import "devextreme/dist/css/dx.material.purple.light.compact.css";
import mqtt from "mqtt";
import notify from "devextreme/ui/notify";
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import { Editing } from "devextreme-react/data-grid";
import { Popup, ToolbarItem } from "devextreme-react/popup";

import { TextArea, TextBox } from "devextreme-react";
import DateBox from "devextreme-react/date-box";
import { receiveTable } from "../../api/auth";

const FormatCurrency = "#0.00;(#0.00)";

export default function Deals2() {
  const [rez1, setRezult] = useState();
  const [data, setData] = useState();
  const [isSelected, setSelected] = useState(false);
  const [selectedDeal, setDealId] = useState({ dealId: 0 });
  const [selectedItem, setDictItem] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [store1, setStore1] = useState(null);
  const dataGridRef = useRef(null);

  console.log("[DEALS] starting>");

  useEffect(() => {
    async function getData() {
      const res = await getDeals();
      console.log("[DEALS] useEffect--loadDelas", res);
      if (!res.isOk) return;
      setData(res.data);
      const data = res.data.map((el) => ({
        typeDeal: convertType(el.typeId),
        company: el.company,
        statusVP: convertStatus(el.statusVP),
        status: el.statusVP,
        shop: el.shop,
        dealDateCreate: el.dealDateCreate,
        quant: el.totalQuant,
        price: el.totalPrice.toFixed(2),
        dealId: el.dealId,
        ownerName: el.ownerName,
        days: Math.round(
          (new Date() - new Date(el.dealDateCreate)) / (1000 * 3600 * 24) + 0.5
        ),
        dateShipment: el.dateShipment,
        commentVP: el.commentVP,
        ownerId: el.ownerId,
      }));
      setRezult(data);

      //   const store1 = new ArrayStore({
      //     key: "dealId",
      //     data: data,
      //   });
      //   setStore1(store1);

      //   const store = new DataSource({
      //     store: store1,
      //     reshapeOnPush: true,
      //   });
      setDataSource(data);
    }
    getData();
  }, []);

  const convertStatus = (status) => {
    if (status === 0) return "новый";
    if (status === 1) return "егаис";
    if (status === 2) return "магазин";
    if (status === 3) return "продан";
    if (status === -1) return "возврат";
    if (status === -2) return "не выкуплен";
  };

  const convertType = (type) => {
    if (type === 0) return "ЗАКАЗ";
    if (type === 1) return "ПОЛКА";
  };

  //   const getProducts = (key) =>
  //     new DataSource({
  //       store: new ArrayStore({
  //         data,
  //         key: "id",
  //       }),
  //       filter: ["id", "=", key],
  //     });

  //   const DetailTemplate = (props) => {
  //     console.log(props);
  //     console.log(data);
  //     return <DataGrid dataSource={getProducts(props.data.data.id)}> </DataGrid>;
  //   };
  const DetailSection = (props) => {
    let d = props.data;
    console.log("master-details");
    console.log(d);
    let res = data.filter((el) => d.dealId === el.dealId);
    //console.log(res);
    res = res[0].products;
    console.log("DetailSection.products", res);
    for (let i = 0; i < res.length; i++) {
      res[i].fact = res[i].quant;
      res[i].price_sale = res[i].total / res[i].quant; //.toFixed(2);
    }

    const cellPriceData = (cellData) => {
      console.log("cellPriceData", cellData);
      return (
        <div>
          <strong>{cellData.text}</strong>
        </div>
      );
    };

    return (
      <DataGrid
        id="grid-container"
        dataSource={res}
        // keyExpr="dealId"
        showBorders={true}
        allowColumnResizing={true}
        columnResizingMode="widget"
        columnAutoWidth={true}
        width={"80%"}
      >
        <Column
          dataField="code"
          caption="Код товара"
          cellRender={({ data }) => (
            <a
              href={`https://luding.ru/collection/?q=${data.code}`}
              target="_blank"
              // rel="noopener noreferrer"
            >
              {data.code}
            </a>
          )}
        />
        <Column
          dataField="barcode"
          caption="Штрихкод"
          cellRender={({ data }) => (
            <a
              href={`https://winestreet.ru/catalog/search/?filter.text=${data.barcode}`}
              target="_blank"
              // rel="noopener noreferrer"
            >
              {data.barcode}
            </a>
          )}
        />
        {/* <Column dataField="company" caption="Компания" /> */}
        <Column dataField="quant" dataType="number" caption="Количество" />
        <Column
          dataField="price"
          //dataType="number"
          format={FormatCurrency}
          caption="Цена базовая"
        />
        <Column dataField="discount" dataType="number" caption="Скидка" />
        <Column
          dataField="price_sale"
          //dataType="number"
          format={FormatCurrency}
          caption="Цена продажи"
          cellRender={cellPriceData}
        />
        <Column dataField="total" caption="Итого" format={FormatCurrency} />
        <Column dataField="name" caption="Название" />
      </DataGrid>
    );
  };

  // это список партнеров/поставщиков
  // с их ссылками на сайты CRM
  // пока временно, а может и постоянно, зависит от подключения в систему других партнеров/поставщиков
  let partnerJson = {
    // Это ownerId Лудинга
    "714004e6-1557-11ec-840e-5800e3fc6bdd": {
      url: "https://crm.l-wine.ru/extranet/pickuppoint/?ID=${dealId}",
    },
    // Это ownerId Прощяна
    "c2ea652c-087e-11ef-8c17-d09466028ae0": {
      url: "",
    },
  };

  String.prototype.format = function (args) {
    var text = this;
    for (var attr in args) {
      var rgx = new RegExp("\\${" + attr + "}", "g");
      text = text.replace(rgx, args[attr]);
    }
    return text;
  };

  const getURL_partnerCRM = (dealJson) => {
    const url = partnerJson[dealJson.ownerId].url;
    // console.log("ownerId>>", dealJson.ownerId);
    // console.log("url=", url);
    if (!url) return "";
    return url.format(dealJson);
  };
  const [curEl, setCurEl] = useState();
  const onSelectionChanged = useCallback(({ selectedRowsData }) => {
    setCurEl(selectedRowsData[0]);
    console.log(selectedRowsData);
    const data = selectedRowsData[0];
    // запониманию сделку/заказ и кто собственник(ownerId) заказа Лудинг или Прощян или др
    setDealId({
      dealId: data.dealId,
      ownerId: data.ownerId,
      commentVP: data.commentVP,
      dateShipment: data.dateShipment,
    });
    setDate(data.dateShipment);
    setAddInfo(data.commentVP);
    setSelected(true);
    setDictItem(data);
  }, []);

  const onFocusedRowChanged = useCallback(({ e }) => {
    console.log("onFocusedRowChanged >", e);
  }, []);

  const onFocusedRowChanging = useCallback(async (e) => {
    console.log("onFocusedRowChanging >", e);
  }, []);

  const rowPrepared = (e) => {
    //console.log(e);
    //console.log(e.isSelected);
    if (e.rowType === "data") {
      if (e.data.statusVP === "новый") {
        e.rowElement.style.backgroundColor = `rgb(255, 38, 0)`; // "red";
        e.rowElement.style.color = "white";
        e.rowElement.style.fontWeight = "bold";
      }
      if (e.data.statusVP === "егаис") {
        e.rowElement.style.backgroundColor = "rgb(189, 159, 93)";
        e.rowElement.style.color = "white";
        e.rowElement.style.fontWeight = "bold";
      }
      if (e.data.statusVP === "магазин") {
        e.rowElement.style.backgroundColor = "green";
        e.rowElement.style.color = "white";
        e.rowElement.style.fontWeight = "bold";
      }
      if (e.data.statusVP === "продан") {
        e.rowElement.style.backgroundColor = "grey";
        e.rowElement.style.color = "white";
        e.rowElement.style.fontWeight = "bold";
      }
    }
  };
  const [dataDeals, setDataDeals] = useState([]);

  const my_status = useRef();
  const [showChangeStatusPopUp, setShowChangeStatusPopUp] = useState(false);
  const [cur, setCur] = useState([]);

  const onSetStatus = function (status) {
    my_status.current = status;
    setShowChangeStatusPopUp(true);
    let dealItem = data.find((el) => el.dealId === selectedDeal.dealId);
    var products = dealItem.products;
    for (let i = 0; i < products.length; i++) {
      products[i].fact = products[i].quant;
      products[i].price_sale = products[i].total / products[i].quant;
    }
    setCur([dealItem]);
  };
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to the MQTT broker

    var options = {
      keepalive: 60,
      username: "max",
      password: "strong_password",
      port: 9001,
    };
    // var options = {
    //   keepalive: 60,
    //   username: "vinopark",
    //   password: "vinopark",
    //   port: 9001,
    //   reconnectPeriod: 5000,
    //   connectTimeout: 30000,
    //   QoS: 3,
    // };

    //     const mqttClient = mqtt.connect("wss://m6.wqtt.ru:19823", options); // Use a WebSocket connection
    // 9001

    const mqttClient = mqtt.connect("ws://localhost:9001", options);
    // const mqttClient = mqtt.connect("ws://194.87.92.32:9001", options);
    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("deal/status", (err) => {
        if (!err) {
          // mqttClient.publish("test/topic", "hello123");
          console.log("Subscribed to topic: deal/status");
        }
      });
      mqttClient.subscribe("add_info", (err) => {
        if (!err) {
          // mqttClient.publish("test/topic", "hello123");
          console.log("Subscribed to topic: add_info");
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      // Message is a Buffer
      // setMessages((prevMessages) => [...prevMessages, message.toString()]);
      //   alert(1);
      notify(message);
      if (topic === "add_info") {
        let info = JSON.parse(message);
        console.log(info);
        setDataSource((data) => {
          return data.map((el) => {
            if (el.dealId === info.dealId) {
              console.log({ ...el, ...info });

              return { ...el, ...info, commentVP: info.comment };
            } else {
              return el;
            }
          });
        });
        return;
      }
      let info = JSON.parse(message);
      setDataSource((prevState) => {
        return prevState.map((item) => {
          if (item.dealId === info.dealId) {
            const updatedItem = {
              ...item,
              status: info.status,
              statusVP: convertStatus(info.status),
            };
            console.log(updatedItem, info.status);
            return updatedItem;
          }
          return item;
        });
      });
      // store1.push([
      //   {
      //     type: "update",
      //     key: info.dealId,
      //     data: {
      //       statusVP: convertStatus(info.status),
      //     },
      //   },
      // ]);
    });

    mqttClient.on("error", (error) => {
      console.error("MQTT connection error:", error);
    });

    mqttClient.on("close", () => {
      console.log("MQTT connection closed");
    });

    mqttClient.on("offline", () => {
      console.log("MQTT client offline");
    });

    setClient(mqttClient);

    // Cleanup on unmount
    return () => {
      if (mqttClient) {
        console.log("END");
        mqttClient.end();
      }
    };
  }, []);

  const onSaveStatus = async function (e) {
    const products = cur[0].products.map((el) => ({
      id: el.id,
      extId: el.extId,
      quant: el.fact,
      price: el.price,
      discount: el.discount,
    }));
    const data = {
      dealId: selectedDeal.dealId,
      ownerId: selectedDeal.ownerId,
      status: my_status.current,
      products,
    };
    console.log(data);
    console.log(dataSource);
    // сохранение статуса REST API

    //!!! const response = await setStatusDeal(data);

    // console.log(response);
    // if (!response.isOk) {
    //   return;
    // }
    setDataSource((prevState) => {
      return prevState.map((item) => {
        if (item.dealId === selectedDeal.dealId) {
          const updatedItem = {
            ...item,
            status: my_status.current,
            statusVP: convertStatus(my_status.current),
          };
          console.log(updatedItem, my_status.current);
          return updatedItem;
        }
        return item;
      });
    });
    // setDataSource(dataSource);
    // store1.push([
    //   {
    //     type: "update",
    //     key: selectedDeal.dealId,
    //     data: {
    //       statusVP: convertStatus(my_status.current),
    //     },
    //   },
    // ]);
    // setStore1(store1);
    client.publish(
      "deal/status",
      JSON.stringify({ dealId: selectedDeal.dealId, status: my_status.current })
    );
    notify(
      `Статус сделки/заявки ${
        selectedDeal.dealId
      } поменялся на "${convertStatus(my_status.current)}"`,
      "info"
    );

    setShowChangeStatusPopUp(false);
  };

  // const onSetStatus = function (statusVP) {
  //   console.log(statusVP);
  //   console.log(
  //     `click item selected DealId=${selectedDeal.dealId}; ownerId=${selectedDeal.ownerId}`
  //   );

  //   let myDialog = custom({
  //     title: "Смена статуса ",
  //     messageHtml: `Вы уверены, что хотите поменять статус сделки/заявки
  //     <b>${selectedDeal.dealId}</b> на ${convertStatus(statusVP)}?`,
  //     buttons: [
  //       {
  //         text: "Сохранить",
  //         onClick: (e) => {
  //           return { result: true };
  //         },
  //       },
  //       {
  //         text: "Выход",
  //         icon: "close",
  //         onClick: (e) => {
  //           return { result: false };
  //         },
  //       },
  //     ],
  //   });

  //   myDialog.show().then((dialogResult) => {
  //     console.log("dialogResult>>>", dialogResult);
  //     if (dialogResult.result) {
  //       console.log("run fynction change status deal");
  //       cst(statusVP); // сохранение в базе
  //       notify(
  //         `Статус сделки/заявки ${
  //           selectedDeal.dealId
  //         } поменялся на "${convertStatus(statusVP)}"`,
  //         "info"
  //       );
  //     }
  //   });
  // };

  // формирование URL ссылки на CRM партнера/поставщика
  // пока не все партнеры/поставщикы поставщики имеют свои CRM и ссылки на них,
  const renderGridDealIdCell = (e) => {
    const url = getURL_partnerCRM({
      dealId: e.data.dealId,
      ownerId: e.data.ownerId,
    });
    if (url)
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          //style={"fontSize :large"}
          style={{ color: "inherit", fontSize: "larger" }}
        >
          {e.data.dealId}
        </a>
      );
    return <div style={{ fontSize: "larger" }}>{e.data.dealId}</div>;
  };

  const refreshDataGrid = async () => {
    const res = await getDeals();
    console.log("[DEALS] useEffect--loadDelas", res);
    if (!res.isOk) return;
    setData(res.data);
    const data = res.data.map((el) => ({
      typeDeal: convertType(el.typeId),
      company: el.company,
      statusVP: convertStatus(el.statusVP),
      status: el.statusVP,
      shop: el.shop,
      dealDateCreate: el.dealDateCreate,
      quant: el.totalQuant,
      price: el.totalPrice.toFixed(2),
      dealId: el.dealId,
      ownerName: el.ownerName,
      days: Math.round(
        (new Date() - new Date(el.dealDateCreate)) / (1000 * 3600 * 24) + 0.5
      ),
      dateShipment: el.dateShipment,
      commentVP: el.commentVP,
      ownerId: el.ownerId,
    }));
    setRezult(data);
    // const store1 = new ArrayStore({
    //   key: "dealId",
    //   data: data,
    // });
    // setStore1(store1);

    // const store = new DataSource({
    //   store: store1,
    //   reshapeOnPush: true,
    // });

    setDataSource(data);
  };

  const [showPopUp, setShowPopUp] = useState(false);

  const AdditionalInfo = () => {
    console.log("01");
    setShowPopUp(true);
  };

  const sendAdditionalInfo = async () => {
    console.log(date);
    let mydate;
    if (date) {
      try {
        mydate = date.toISOString().split("T")[0];
      } catch (e) {
        mydate = date.split("T")[0];
      }
    }
    // Сохранение в REST API
    let res;
    try {
      res = await updateDealExtraInfo({
        dealId: selectedDeal.dealId,
        ownerId: selectedDeal.ownerId,
        comment: addInfo,
        dateShipment: mydate,
      });
    } catch (e) {
      console.log(e);
    }
    client.publish(
      "add_info",
      JSON.stringify({
        dealId: selectedDeal.dealId,
        ownerId: selectedDeal.ownerId,
        comment: addInfo,
        dateShipment: mydate,
      })
    );
    // Обработка ответа
    let ds = [...dataSource];
    if (res) {
      for (let i = 0; i < ds.length; i++) {
        if (ds[i].dealId === selectedDeal.dealId) {
          ds[i] = {
            ...ds[i],
            commentVP: addInfo,
            dateShipment: date,
          };
        }
      }
      setDataSource(ds);
      //   store1.push([
      //     {
      //       type: "update",
      //       key: selectedDeal.dealId,
      //       data: {
      //         commentVP: addInfo,
      //         dateShipment: date,
      //       },
      //     },
      //   ]);
      setShowPopUp(false);
    }
  };

  const [addInfo, setAddInfo] = useState();
  const [date, setDate] = useState();
  const [showTable, setShowTable] = useState(false);
  const [changesTable, setChangesTable] = useState([]);

  //console.log(cur[0].products);
  // const save = (e) => {
  //   console.log(e);
  //   for (let j = 0; j < e.changes.length; j++) {
  //     const id = e.changes[j].data.id;
  //     for (let i = 0; i < cur[0].products.length; i++) {
  //       if (cur[0].products[i].id === id) {
  //         cur[0].products[i].fact = e.changes[j].fact;
  //       }
  //     }
  //   }
  //   setCur(cur);
  // };

  const [showRemaining, setShowRemaining] = useState(false);
  const [remainingData, setRemainingData] = useState([]);
  // const onfocus = (e) => {
  //   console.log(e);
  //   // console.log(selectedRowsData);
  //   const data = e.row.data;
  //   // запониманию сделку/заказ и кто собственник(ownerId) заказа Лудинг или Прощян или др
  //   setDealId({
  //     dealId: data.dealId,
  //     ownerId: data.ownerId,
  //     commentVP: data.commentVP,
  //     dateShipment: data.dateShipment,
  //   });
  //   setDate(data.dateShipment);
  //   setAddInfo(data.commentVP);
  //   setSelected(true);
  //   setDictItem(data);
  // };
  const onfocus = (e) => {
    console.log("OnFocus = ", e);
  };
  useEffect(() => {
    // if (!dataSource) return;
    console.log("dataSource = ", dataSource);
  }, [dataSource]);
  return (
    <>
      {showRemaining && (
        <Popup
          width={"55%"}
          height={"50%"}
          visible={true}
          onHiding={() => {
            setShowRemaining(false);
          }}
          title={"Оставшиеся продукты"}
          showCloseButton={true}
          hideOnOutsideClick={true}
        >
          <DataGrid
            dataSource={remainingData}
            // onSaving={save}
            //width={"auto"}
            //height={"auto"}
            //showBorders={true}
            columnAutoWidth={true}
          >
            <Column
              dataField="fact"
              caption="Факт"
              width={100}
              dataType="number"
            />
            <Column
              dataField="quant"
              caption="Количество"
              width={100}
              dataType="number"
            />
            <Column
              dataField="price"
              caption="Цена"
              width={100}
              dataType="number"
            />
            <Column
              dataField="discount"
              caption="Скидка"
              width={100}
              dataType="number"
            />
            <Column
              dataField="dateCreate"
              caption="Дата создания"
              width={200}
            />
            <Column
              dataField="barcode"
              caption="Штрих-код"
              width={150}
              dataType="number"
            />
            <Column dataField="name" caption="Название" width={150} />
            <Column dataField="dealId" width={100} />
            <Selection mode="single" />
          </DataGrid>
        </Popup>
      )}
      {showChangeStatusPopUp && (
        <Popup
          width={"55%"}
          height={"50%"}
          visible={true}
          onHiding={() => {
            setShowChangeStatusPopUp(false);
          }}
          title={() => `Смена статуса`}
          showCloseButton={true}
          hideOnOutsideClick={true}
        >
          <p style={{ color: "black", fontSize: "xx-large" }}>
            Вы уверены, что хотите поменять статус сделки/заявки{" "}
            <b>{selectedDeal.dealId}</b> на "
            <b>{convertStatus(my_status.current)}</b>"?
          </p>

          <DataGrid
            dataSource={cur[0].products}
            keyExpr={"id"}
            //onSaving={save}
            //width={"auto"}
            //height={"auto"}
            //showBorders={true}
            columnAutoWidth={true}
          >
            <Editing mode="cell" allowUpdating={true} />
            <Column
              dataField="fact"
              caption="Факт"
              width={100}
              dataType="number"
            />
            <Column
              dataField="quant"
              caption="Количество"
              width={100}
              allowEditing={false}
              dataType="number"
            />
            <Column
              dataField="price"
              caption="Цена"
              allowEditing={false}
              width={200}
              dataType="number"
              format={FormatCurrency}
            />
            <Column
              dataField="discount"
              caption="Скидка"
              allowEditing={false}
              width={100}
              dataType="number"
            />
            <Column
              dataField="name"
              caption="Название"
              allowEditing={false}
              dataType="string"
            />
            <Selection mode="single" />
          </DataGrid>

          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            stylingMode="contained"
            options={{
              icon: "save",
              stylingMode: "contained",
              text: "Сохранение",
              onClick: onSaveStatus,
            }}
          />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            stylingMode="contained"
            options={{
              icon: "close",
              stylingMode: "contained",
              text: "Выход",
              onClick: () => setShowChangeStatusPopUp(false),
            }}
          />
        </Popup>
      )}
      {showTable && (
        <Popup
          visible={true}
          onHiding={() => {
            setShowTable(false);
          }}
          title={`Инфо, заказ ${selectedDeal.dealId}`}
          width="auto"
          height="auto"
          showCloseButton={true}
        >
          <DataGrid
            dataSource={changesTable}
            //allowColumnReordering={true}
            //rowAlternationEnabled={true}
            showBorders={true}
            width="600px"
          >
            <Column
              dataField="dateUpdate"
              dataType="datetime"
              format="dd/MM/yyyy HH:mm"
              caption="Дата изменения"
            />
            <Column dataField="status" caption="Статус" dataType="string" />
            <Column dataField="userName" caption="Пользователь" />
          </DataGrid>
          {/* <div style={{ marginTop: "10px" }}> */}
          {/* <Toolbar>
            <Item location="after" widget="dxButton" locateInMenu="auto">
              <Button text="Выход" onClick={() => setShowTable(false)} />
            </Item>
          </Toolbar> */}
          {/* </div> */}
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={{ icon: "close", text: "Выход" }}
            onClick={() => setShowTable(false)}
          />
        </Popup>
      )}
      <Popup
        onHiding={() => {
          setShowPopUp(false);
        }}
        visible={showPopUp}
        title={() => `Доп информация, заказ ${selectedDeal.dealId}`}
        showCloseButton={true}
        position="center"
        width="auto"
        height="auto"
      >
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Заказ отложен до: </div>
            <div className="dx-field-value">
              <DateBox
                type="date"
                defaultValue={new Date()}
                displayFormat="dd/MM/yyyy"
                value={date}
                onValueChanged={(e) => {
                  console.log(e);
                  setDate(e.value);
                }}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">
              Дополнительная информация по заказу:
            </div>
            <div className="dx-field-value">
              <TextArea
                value={addInfo}
                onValueChanged={(e) => setAddInfo(e.value)}
              />
            </div>
          </div>
        </div>
        <ToolbarItem
          widget="dxButton"
          location="after"
          toolbar="bottom"
          options={{ icon: "save", text: "Сохранить" }}
          onClick={sendAdditionalInfo}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{ icon: "close", text: "Выход" }}
          onClick={() => setShowPopUp(false)}
        />
      </Popup>

      <div className="view crm-deals-list">
        <div className="view-wrapper view-wrapper-deals-list list-page">
          <DataGrid
            id="gridContainer"
            className="grid theme-dependent"
            dataSource={dataSource}
            // ref={dataGridRef}
            keyExpr="dealId"
            showBorders={true}
            //showColumnLines={true}
            showRowLines={true}
            showColumnHeaders={true}
            showColumnLines={true}
            onRowPrepared={rowPrepared}
            focusedRowEnabled={true}
            allowColumnResizing={true}
            columnResizingMode="widget"
            columnAutoWidth={true}
            //columnWidth="auto"
            //onCellClick={clck}
            //hoverStateEnabled={true}
            //repaintChangesOnly={true}
            height="100%"
            width="auto"
            repaintChangesOnly={true}
            onSelectionChanged={onSelectionChanged}
            onFocusedRowChanging={onfocus}
            // onFocusedCellChanged={onfocus}
          >
            <HeaderFilter visible={true} />
            <Selection mode="single" />
            <Paging enabled={false} />
            <SearchPanel visible={true} width={340} placeholder="Поиск..." />
            {/* Тип */}
            <Column
              dataField="typeDeal"
              caption="Тип"
              visibleIndex="0"
              width="auto"
            />
            {/* Поставщик */}
            <Column
              dataField="ownerName"
              caption="Поставщик"
              visibleIndex="0"
              //fixed={true}
              width="auto"
            />
            {/* Статус */}
            <Column dataField="statusVP" caption="Статус" width="auto" />
            {/* Номер сделки */}
            <Column
              dataField="dealId"
              caption="№ сделки/заказа"
              visibleIndex="1"
              allowSearch={true}
              cellRender={renderGridDealIdCell}
              width="auto"
              options={{ fontSize: "larger" }}
            />
            {/* Торговая точка */}
            <Column dataField="shop" caption="Торговая точка" width="auto" />
            {/* Дата создания */}
            <Column
              dataField="dealDateCreate"
              caption="Дата создания"
              dataType="date"
              format="dd/MM/yyyy"
              width="auto"
              hidingPriority={0}
            />
            {/* Сколько дней прошло после создания заказа */}
            <Column dataField="days" caption="Дней" width="auto" />
            <Column caption="Баланс сделки/заявки">
              // Количество
              <Column
                dataField="quant"
                dataType="number"
                caption="Количество"
                width="auto"
              />
              {/* Сумма сделки/заказа */}
              <Column
                dataField="price"
                dataType="number"
                format={FormatCurrency}
                caption="Сумма сделки"
                options={{ fontSize: "lager" }}
                width="auto"
              />
            </Column>
            {/* Дата, мы устанавливаем, если клиент просит перенести заказ на некую дату */}
            <Column
              dataField="dateShipment"
              dataType="date"
              caption="Дата события"
              format="dd/MM/yyyy"
              width="auto"
              hidingPriority={1}
            />
            {/* Комментарий, который мы даем на сделку/заказ */}
            <Column
              dataField="commentVP"
              caption="Комментарий"
              hidingPriority={1}
            />
            <Toolbar>
              <Item location="before">
                <div className="grid-header">Статусы сделок/заказов:</div>
              </Item>
              <Item location="before">
                <div className="toolbar-separator"></div>
              </Item>
              <Item location="before" widget="dxButton" locateInMenu="auto">
                <Button
                  id="btn_new"
                  icon="tags"
                  text="новый"
                  stylingMode="outlined"
                  //style={{ color: "white", backgroundColor: "red" }}
                  disabled={!isSelected}
                  onClick={() => onSetStatus(0)}
                />
              </Item>
              <Item location="before" widget="dxButton" locateInMenu="auto">
                <Button
                  id="btn_egais"
                  icon="tags"
                  text="ЕГАИС"
                  stylingMode="outlined"
                  //style={{ color: "white", backgroundColor: "#498b49" }}
                  disabled={!isSelected}
                  onClick={() => onSetStatus(1)}
                />
              </Item>
              <Item location="before" widget="dxButton" locateInMenu="auto">
                <Button
                  id="btn_shop"
                  icon="tags"
                  text="магазин"
                  stylingMode="outlined"
                  //style={{ color: "white", backgroundColor: "green" }}
                  disabled={!isSelected}
                  onClick={() => onSetStatus(2)}
                />
              </Item>
              <Item location="before" widget="dxButton" locateInMenu="auto">
                <Button
                  id="btn_sale"
                  icon="tags"
                  text="продан"
                  stylingMode="outlined"
                  //style={{ color: "white", backgroundColor: "gray" }}
                  disabled={!isSelected}
                  onClick={() => onSetStatus(3)}
                />
              </Item>
              <Item location="before" widget="dxButton" locateInMenu="auto">
                <Button
                  id="btn_ret"
                  icon="tags"
                  text="возврат"
                  stylingMode="outlined"
                  //style={{ color: "white", backgroundColor: "black" }}
                  disabled={!isSelected}
                  onClick={() => onSetStatus(-1)}
                />
              </Item>
              <Item location="before" widget="dxButton" locateInMenu="auto">
                <Button
                  id="btn_ret"
                  icon="tags"
                  text="не выкуплен"
                  stylingMode="outlined"
                  //style={{ color: "white", backgroundColor: "black" }}
                  disabled={!isSelected}
                  onClick={() => onSetStatus(-2)}
                />
              </Item>
              <Item location="before">
                <div className="toolbar-separator"></div>
              </Item>
              {/* Показываем сделку/заказ, когда выбран в гриде */}
              <Item
                location="before"
                text={selectedDeal.dealId === 0 ? "" : selectedDeal.dealId}
                className="informer"
              ></Item>
              {/* Дополнительная информация о сделке/заказе */}
              <Item locateInMenu="auto" location="after">
                <Button
                  text="Доп инфо"
                  icon="verticalaligntop"
                  disabled={!isSelected}
                  onClick={AdditionalInfo}
                />
              </Item>
              <Item locateInMenu="auto" location="after">
                <Button
                  text="Остатки"
                  icon="verticalaligntop"
                  // disabled={!isSelected}
                  onClick={async () => {
                    setShowRemaining(true);
                    let data = (await getRemainingProducts()).data;
                    data = data.map((el) => ({ ...el, fact: el.quant }));
                    setRemainingData(data);
                  }}
                />
              </Item>
              <Item locateInMenu="auto" location="after">
                <Button
                  text="mqtt"
                  icon="verticalaligntop"
                  // disabled={!isSelected}
                  onClick={async () => {
                    client.publish("deal/status", JSON.stringify(curEl));
                  }}
                />
              </Item>
              <Item location="after">
                <div className="toolbar-separator"></div>
              </Item>
              <Item location="after">
                <Button
                  icon="info"
                  disabled={!isSelected}
                  onClick={async () => {
                    setChangesTable(
                      (
                        await receiveTable({
                          dealId: selectedDeal.dealId,
                          ownerId: selectedDeal.ownerId,
                        })
                      ).map((el) => ({
                        ...el,
                        status: convertStatus(el.status),
                      }))
                    );
                    console.log(changesTable);
                    setShowTable(true);
                  }}
                />
              </Item>
              <Item location="after">
                <Button icon="refresh" onClick={refreshDataGrid} />
              </Item>
              {/* Поиск сделки/Заказа */}
              <Item name="searchPanel" locateInMenu="auto" />
            </Toolbar>
            {/* <MasterDetail enabled={true} component={DetailTemplate} /> */}
            <MasterDetail
              enabled={true}
              autoExpandAll={false}
              render={DetailSection}
              // component={DetailTemplate}
            />
          </DataGrid>
        </div>
      </div>
    </>
  );
}
