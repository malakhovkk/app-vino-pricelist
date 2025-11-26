import { useEffect, useState, useRef, useCallback } from "react";
import {
  addItems,
  getCategories,
  GetOrdercontent,
  getBinds,
  sendBinds,
  getPricelist,
  GetStocks,
  createOrder,
  GetOrders,
  sendEmail,
  getProduct,
  getImage,
  deleteBind,
} from "../../restApi/index";
import SelectBox from "devextreme-react/select-box";
import useStore from "../../zustand";
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
} from "devextreme-react/data-grid";

import Button from "devextreme-react/button";
import themes from "devextreme/ui/themes";
import notify from "devextreme/ui/notify";
import ArrayStore from "devextreme/data/array_store";
import { Editing } from "devextreme-react/data-grid";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import { CheckBox, CheckBoxTypes } from "devextreme-react/check-box";
import EmailPopUp from "../../mycomponents/popups/EmailPopUp";
import { MasterDetail } from "devextreme-react/data-grid";
import "./pricelist.scss";
import "devextreme/dist/css/dx.material.purple.light.css";
import { Popup } from "devextreme-react";
import List, { ListTypes } from "devextreme-react/list";
import TreeList, { Lookup } from "devextreme-react/tree-list";

const FormatCurrency = "#0.00;(#0.00)";

export default function Pricelist({ vendorId }) {
  const {
    setContactPopUp,
    setShowPopUp,
    setCreatePopUp,
    setContactInfo,
    contactPopUp,
    // setVendorId,
    // vendorId,
    contacts,
    setContactId,
    setContacts,
    isPricelist,
    setIsPricelist,
    // pricelist,
    // setPricelist,
  } = useStore();

  let dataGrid2;
  // Хранилице products
  const [store, setStore] = useState(null);
  const [pricelist, setPricelist] = useState([]);
  const [shops, setShops] = useState([]);
  const dataGridRef = useRef(null);

  function toTypeGrid(dataType) {
    // типы в grid -> 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
    switch (dataType) {
      case "quantity":
      case "money":
        return "number";
      case "array":
        return "object";
      default:
        return "string";
    }
  }

  function toTypeFormat(dataType) {
    // типы в grid -> 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
    switch (dataType) {
      case "quantity":
        return "#";
      case "money":
        return "#0.00";
    }
  }

  const [binds, setBinds] = useState();
  useEffect(() => {
    (async function () {
      //alert(1);
      setShops(await GetStocks());
      const p = await getPricelist(vendorId);
      console.log(p);
      //alert(2);
      setPricelist(p);
    })();
  }, []);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (store) {
      console.log("UseEffect", store);
      setLoading(false);
    }
  }, [store]);

  const refreshData = async () => {
    const p = await getPricelist(vendorId);
    console.log(p);
    //alert(2);
    setPricelist(p);
  };
  const dateFormat = "dd/MM/yyyy";
  // функция формирование колонок для devexpress Grid
  // типы в grid -> 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
  async function GetcolumnsPL(pricelist) {
    const stocks = await GetStocks();
    var columns = [
      { dataField: "id", visible: false },
      { dataField: "linkId", visible: false },
    ];
    columns.push({
      dataField: "base_groups",
    });
    // колонки профайла
    for (var i = 0; i < pricelist.profile.columns.length; i++) {
      const Item = {};
      Item["caption"] = pricelist.profile.columns[i].name;
      Item["dataField"] = pricelist.profile.columns[i].code;
      Item["dataType"] = toTypeGrid(pricelist.profile.columns[i].dataType);
      Item["format"] = toTypeFormat(pricelist.profile.columns[i].dataType);
      columns.push(Item);
    }
    columns.push({
      caption: "1C",
      dataField: "1C",
    });

    // колонки статистики +  остатки номенкратуры на складе
    for (var i = 0; i < stocks.length; i++) {
      var items = {
        caption: stocks[i].name,
        columns: [
          // колонки статистики +  остатки номенкратуры на складе
          {
            caption: "Дата-In",
            dataField: stocks[i].id + "_" + "date_last_in",
            dataType: "date",
            format: dateFormat,
          },
          {
            caption: "Цена-In",
            dataField: stocks[i].id + "_" + "price_last_in",
            dataType: "number",
          },
          {
            caption: "Дата-Sale",
            dataField: stocks[i].id + "_" + "date_last_sale",
            dataType: "date",
            format: dateFormat,
          },
          {
            caption: "Цена-Sale",
            dataField: stocks[i].id + "_" + "price_last_sale",
            dataType: "number",
          },
          // остатки номенкратуры на складе
          {
            caption: "Остаток",
            dataField: "quant_" + stocks[i].name,
            dataType: "number",
          },
        ],
      };
      columns.push(items);
    }
    console.log("Colums >>>", columns);
    return columns;
  }

  async function ReloadPriceList(pricelist) {
    var products = [];
    let binds_res = [];
    const stocks = await GetStocks();
    for (var i = 0; i < pricelist.productsList.products.length; i++) {
      var productItem = pricelist.productsList.products[i];
      // добавляем в элементы meta, которые описаны в profile
      var item = {};
      for (var c = 0; c < pricelist.profile.columns.length; c++) {
        var key = pricelist.profile.columns[c].code;
        if (productItem.meta[key] != undefined) {
          item[key] = productItem.meta[key];
        }
      }
      // добавляем в элементы staticts
      for (var j = 0; j < productItem.prodStatistics.length; j++) {
        key = productItem.prodStatistics[j].stock_uid + "_";
        item[key + "date_last_in"] = productItem.prodStatistics[j].date_last_in;
        item[key + "price_last_in"] =
          productItem.prodStatistics[j].price_last_in / 100;
        item[key + "date_last_sale"] =
          productItem.prodStatistics[j].date_last_sale;
        item[key + "price_last_sale"] =
          productItem.prodStatistics[j].price_last_sale / 100;
      }
      // добавляем остатков в магазинах
      //const stocks = GetStocks();
      if (productItem.stockInfo != undefined) {
        for (var j = 0; j < stocks.length; j++) {
          key = stocks[j].name;
          item["quant_" + key] = productItem.stockInfo[key];
        }
      }
      item["linkId"] = productItem.linkId;
      item["order_quant"] = 0;
      // Иденитификатор продукта !!!
      item["id"] = productItem.id;
      item["1C"] = productItem.linkId ? "1C" : "";
      item["base_groups"] = productItem.prodBinds
        .reduce((acc, cur) => acc + "," + cur.group_name, "")
        .slice(1);
      binds_res[productItem.id] = productItem.prodBinds.map(
        (el) => el.group_rec_id
      );
      products.push(item);
    }
    setBinds(binds_res);
    console.info("ReloadPriceList", products);
    // сохраняем в store
    const store = new ArrayStore({
      key: "id",
      data: products,
      reshapeOnPush: true,
    });
    setStore(store);
    return products;
  }

  const [reloadpricelist, setReloadPriceList] = useState([]);
  const [columnsPL, setColumnsPL] = useState([]);

  useEffect(() => {
    (async function () {
      if (!pricelist) return;
      if (pricelist.length === 0) return;
      setColumnsPL(await GetcolumnsPL(pricelist));
      setReloadPriceList(await ReloadPriceList(pricelist));
    })();
  }, [pricelist]);

  //console.log(isPricelist, pricelist);
  //console.log(reloadpricelist, columnsPL);

  const rowPrepared = (e) => {
    //console.log(e);
    //console.log(e.isSelected);
    if (e.rowType === "data") {
      if (e.data.order_quant > 0) {
        e.rowElement.style.backgroundColor = "purple";
        e.rowElement.style.color = "white";
      } else if (e.data.linkId) {
        e.rowElement.style.backgroundColor = "yellow";
        e.rowElement.style.color = "black";
        e.rowElement.style.fontWeight = "bold";
      }
    }
  };
  const [allMode, setAllMode] = useState("allPages");
  const [checkBoxesMode, setCheckBoxesMode] = useState(
    themes.current().startsWith("material") ? "always" : "onClick"
  );
  const onCheckBoxesModeChanged = useCallback(({ value }) => {
    setCheckBoxesMode(value);
  }, []);

  const onAllModeChanged = useCallback(({ value }) => {
    setAllMode(value);
  }, []);

  const [cart, setCart] = useState([]);
  const [cur, setCur] = useState();
  const onSelectionChanged = (e) => {
    console.log("onSelectionChanged >>", e);
    const item = e.selectedRowsData[0];
    console.log("onSelectionChanged.item >>", item);
    if (item) setCur(item);
    console.log("onSelectionChanged.cur >>", cur);
  };

  const [count, setCount] = useState(0);
  const onClickPlus = (e) => {
    console.log("onClickPlus.cur >>>", cur);
    cur.order_quant++;
    if (cur.order_quant === 1) {
      cart.push({
        id: cur.id, // Это идентификатор продукта
        name: cur.name,
        price: cur.price.replace(/,/, "."),
        order_quant: 1,
      });
      setCount(count + 1);
    }
    for (let i = 0; i < cart.length; i++) {
      if (cur.id === cart[i].id) {
        cart[i].order_quant = cur.order_quant;
      }
    }
    console.log("onClickPlus.cart >>> ", cart);
    setCart(cart);
    store.update(cur.id, cur);
    console.log("onClickPlus.dataGridRef >>>", dataGridRef);
    notify(`${cur.name} добавили в корзину ${cur.order_quant}`);
    setCur(cur);
    //dataGridRef.current.instance().refresh();
  };

  //console.log(cart);
  const onClickMinus = (e) => {
    if (cur.order_quant > 0) cur.order_quant--;
    if (cur.order_quant === 0) {
      let to_remove = -1;
      let new_cart = [];
      for (let i = 0; i < cart.length; i++) {
        if (cur.id === cart[i].id) {
          to_remove = i;
        }
      }
      for (let i = 0; i < cart.length; i++) {
        if (to_remove !== i) new_cart.push(cart[i]);
      }
      setCart(new_cart);
    } else {
      for (let i = 0; i < cart.length; i++) {
        if (cur.id === cart[i].id) {
          cart[i].order_quant = cur.order_quant;
        }
      }
      setCart(cart);
    }
    store.update(cur.id, cur);
    console.debug(dataGridRef);
    notify(`${cur.name} удалили из корзины ${cur.order_quant}`);
    setCur(cur);
  };
  //console.log("Cart = ", cart);
  const [isCart, setIsCart] = useState(false);
  const showCart = () => {
    setIsCart(true);
  };

  useEffect(() => {
    for (let i = 0; i < cart.length; i++) {
      cart[i].sum = cart[i].order_quant * cart[i].price;
    }
    console.log("useEffect ___", cart);
    setCart(cart);
  }, [isCart]);

  //console.log("Cart=", cart);

  const onChange = (e) => {
    // alert(33);
    console.log(">>> ", e);
    let myid = e.key;
    console.log(cart);
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === myid) {
        cart[i].sum = e.data.order_quant * e.data.price;
        console.log(cart[i].sum);
        // console.log(myid, e[0].key.order_quant, e[0].data.price, cart[i].sum);
      }
    }
    setCart(cart);
  };
  const [comm, setComm] = useState("");
  const [shop, setShop] = useState("");
  const [res, setRes] = useState({});
  const orderId = useRef();

  //console.log(orderId);
  const saveCart = async () => {
    let shopId = "";
    for (let i = 0; i < shops.length; i++) {
      if (shops[i].name === shop) {
        shopId = shops[i].id;
      }
    }
    // const res = {};
    const my_order = await createOrder({ comment: comm, shopId, vendorId });
    setRes(my_order);
    addToCart(my_order.id);
    setIsIEmailSave(true);
  };

  const addToCart = (orderId) => {
    let content = [];
    content.push(
      ...cart.map((el) => ({
        // orderId: orderId.current,
        orderId,
        quant: el.order_quant,
        sum: el.price * el.order_quant,
        product: {
          id: el.id,
        },
      }))
    );
    addItems(content);
    setCart([]);
    for (let i = 0; i < reloadpricelist.length; i++) {
      reloadpricelist[i].order_quant = 0;
    }
    setReloadPriceList(reloadpricelist);
  };
  const onRemove = (e) => {
    // alert(1);
    console.log(e);
    setReloadPriceList(
      reloadpricelist.map((el) => {
        if (el.id !== e.data.id) return el;
        else return { ...el, order_quant: 0 };
      })
    );
    setCart(
      cart.map((el) => {
        if (el.id !== e.data.id) return el;
        else return { ...el, order_quant: 0 };
      })
    );
  };
  const [checkbox, setCheckbox] = useState(false);
  const [isEmailSave, setIsIEmailSave] = useState(false);
  const [isOrders, setisOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const showOrders = async () => {
    setisOrders(true);
    setOrders(await GetOrders(vendorId));
  };

  const renderDetail = async (e) => {
    console.log(e);
    let res = await GetOrdercontent(e.data.id);
    console.log(res);
    return <DataGrid dataSource={res} />;
  };
  const [selected, setSelected] = useState();
  const number = useRef();
  const onSelection = (e) => {
    console.log(e);
    setSelected(e);
    setMy_id(e.selectedRowKeys[0].id);
    orderId.current = e.selectedRowKeys[0].id;
    number.current = e.selectedRowsData[0].number;
    console.log(orderId.current);
  };
  const [my_id, setMy_id] = useState();
  const [toAdd, setToAdd] = useState();

  const addOrder = async () => {
    console.log(my_id);
    let res = (await GetOrdercontent(my_id)).map((el) => ({
      id: el.product.id,
      order_quant: el.quant,
      name: el.product.name,
      price: el.sum / el.quant,
    }));
    console.warn(res, reloadpricelist);
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < reloadpricelist.length; j++) {
        if (reloadpricelist[j].id === res[i].id) {
          reloadpricelist[j].order_quant += res[i].order_quant;
          console.warn(">>> ", reloadpricelist[j].id, res[i].order_quant);
        }
      }
    }

    for (let j = 0; j < reloadpricelist.length; j++) {
      if (reloadpricelist[j].order_quant > 0) {
        let exists = false;
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === reloadpricelist[j].id) {
            cart[i].order_quant = reloadpricelist[j].order_quant;
            cart[i].name = reloadpricelist[j].name;
            cart[i].price = reloadpricelist[j].price;
            exists = true;
          }
        }
        if (!exists) {
          cart.push({
            id: reloadpricelist[j].id,
            name: reloadpricelist[j].name,
            order_quant: reloadpricelist[j].order_quant,
            price: reloadpricelist[j].price,
          });
        }
      }
    }
    setCart(cart);
    setReloadPriceList(reloadpricelist);
    // res = res.map((el) => {
    //   return { id: el.id, order_quant: el.quant };
    // });
    // let pricelist1 = [];
    // pricelist1 = reloadpricelist;
    // for (let i = 0; i < res.length; i++) {
    //   {
    //     if (res[i].id === reloadpricelist[j].id) {
    //       pricelist1[i] = {
    //         ...reloadpricelist[j],
    //         order_quant: reloadpricelist[j].order_quant + res[i].order_quant,
    //       };
    //     }
    //   }
    // }
    // console.warn(pricelist1);
    // setReloadPriceList(pricelist1);
  };

  const MasterDetailView = (e) => {
    console.log(e);
    const [data, setData] = useState([]);
    useEffect(() => {
      (async function () {
        setData(
          (await GetOrdercontent(e.data.data.id)).map((el) => ({
            id: el.id, // Это идентификатор продукта
            sku: el.product.sku,
            name: el.product.name,
            quant: el.quant,
            sum: el.sum,
            comment: el.comment,
          }))
        );
      })();
    }, []);

    // async function get_all() {
    //   return await GetOrdercontent(e.data.data.id);
    // }
    // res = get_all();
    console.log(res);
    return (
      <DataGrid keyExpr={"id"} dataSource={data}>
        <Column dataField="sku" />
        <Column dataField="name" />
        <Column dataField="quant" />
        <Column dataField="sum" format={FormatCurrency} />
        <Column dataField="comment" />
      </DataGrid>
    );
  };
  const sendMail = () => {
    console.log(selected);
    sendEmail({
      OrderId: selected.selectedRowsData[0].id,
      EmailList: selected.selectedRowsData[0].eMailSend,
      ShopId: selected.selectedRowsData[0].shopId,
    });
  };
  const [info, setInfo] = useState([]);
  const [base, setBase] = useState("");
  const [showIm, setShowIm] = useState(false);

  const showImage = async (e) => {
    console.log(e);
    const data = await getProduct(e.data.id);
    const img1 = await getImage(e.data.id);
    setBase(img1.photo);
    console.log(data);
    if (!data.meta.json) return;
    setInfo(data.meta.json);
    setShowIm(true);
  };

  //console.log(info);
  let curTable = [];
  for (var key in info) {
    curTable.push({ name: key, val: info[key] });
  }
  useEffect(() => setCount(cart.length), [cart]);
  //console.warn(">>> ", reloadpricelist);
  const [mult, setMult] = useState(false);
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);

  const onValueChanged = useCallback((e) => {
    //alert(e.value);
    console.log("check--", e);
    console.log("check-- dataGrid2", dataGrid2);
    if (e.value) {
      setMult(true);
    } else {
      setMult(false);
    }
    // reset
    setSelectedItemTree([]);
    //dataGrid2.defaultSelectedRowKeys = [];
  }, []);

  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  const showMain = useCallback(async (e) => {
    console.log("show caterg", e);
    console.log(selectedItemKeys);
    let data = (await getCategories()).map((el) => {
      if (!el.parent) {
        delete el.parent;
      }
      return el;
    });
    setCategories(data);
    console.log(data);
    // setCategories([
    //   { name: "sd", id: "1-1" },
    //   { name: "sd", id: "2-1", parent: "1-1" },
    //   { name: "sd", id: "4-1" },
    // ]);
    setShowCategories(true);
  }, []);

  const [selectedItemTree, setSelectedItemTree] = useState([]);
  const [selectedRowKeysMain, setSelectedRowKeysMain] = useState([]);
  const onMulChange = (data) => {
    console.log(data);
    // let res = [];
    // data.selectedRowKeys.forEach((el) => (el) => res.push(...binds[el]));
    // console.warn("!!!", res);
    // setSelectedItemTree(res);
    // setSelectedItemTree(binds[data.selectedRowKeys]);
    console.warn(">>> ", data.selectedRowKeys);
    let res = [];
    data.selectedRowKeys.forEach((el) => res.push(...binds[el]));
    setSelectedItemKeys(data.selectedRowKeys);
    setSelectedItemTree(res);
  };

  //console.warn(">>> ", selectedItemTree);
  const onSelectionChangedTree = (data) => {
    setSelectedItemTree(data.selectedRowKeys);
  };

  const onInitialized = useCallback((e) => {
    dataGrid2 = e.component;
    console.log("onInitialized", dataGrid2);
  }, []);

  const dataGrid = useRef();
  const FormatCurrency = "#0.00;(#0.00)";
  const [showEmailPopUp, setShowEmailPopUp] = useState(false);
  //console.log(categories);
  return (
    <div>
      <div>
        <LoadPanel
          container=".price-grid"
          //showPane={false}
          visible={true}
          position={{ of: ".price-grid" }}
          showIndicator={true}
          message="Загрузка прайс листа ... "
        />
      </div>

      {showCategories && (
        <Popup
          visible={true}
          title={"КАТЕГОРИИ НОМЕНКЛАТУРЫ"}
          onHiding={() => setShowCategories(false)}
          showCloseButton={true}
          width={"30%"}
          //style={{width: "max-content"}}
        >
          <TreeList
            keyExpr="id"
            dataSource={categories}
            parentIdExpr="parent"
            selectedRowKeys={selectedItemTree}
            onSelectionChanged={onSelectionChangedTree}
            columnAutoWidth={true}
            autoExpandAll={true}
            showBorders={true}
            focusedRowEnabled={true}
          >
            <Selection mode="multiple" />
            <SearchPanel visible={true} />
            <Column dataField="name" caption="КАТЕГОРИЯ НОМЕНКЛАТУРЫ" />
            <LoadPanel enabled={true} />
          </TreeList>
          <Button
            text="Сохранить"
            onClick={async () => {
              console.warn("123", selectedItemKeys, selectedItemTree);
              selectedItemKeys.forEach(async (el) => {
                const res = await getBinds(el);
                for (let j = 0; j < res.prodBinds.length; j++) {
                  if (
                    !selectedItemTree.includes(res.prodBinds[j].group_rec_id)
                  ) {
                    deleteBind(res.prodBinds[j].id);
                  }
                }
                console.log(selectedItemTree, res.prodBinds);
              });
              await sendBinds(selectedItemKeys, selectedItemTree);
              console.warn(selectedItemKeys, selectedItemTree);
              setShowCategories(false);
              selectedItemKeys.forEach(async (el) => {
                const res = await getBinds(el);
                // alert(1);
                console.log(res, reloadpricelist);
                for (let i = 0; i < reloadpricelist.length; i++) {
                  if (reloadpricelist[i].id === res.id) {
                    // alert(1);
                    let res_str = "";
                    if (res.prodBinds.length > 0)
                      res_str = res.prodBinds[0].group_name;
                    for (let j = 1; j < res.prodBinds.length; j++) {
                      res_str += ", " + res.prodBinds[j].group_name;
                    }
                    reloadpricelist[i].base_groups = res_str;
                    // alert(res_str);
                    console.log(reloadpricelist.id);
                    console.warn(res_str);
                    // alert(reloadpricelist.id);
                  }
                }

                // console.warn(>>>>", res);
              });
              setReloadPriceList(reloadpricelist);
              // dataGrid.refresh()
              // dataGrid1.refresh();
              // const p = await getPricelist(vendorId);
              // console.log(p);
              // //alert(2);
              // setPricelist(p);
            }}
          />
        </Popup>
      )}
      {showIm && (
        <Popup
          visible={true}
          title={info?.name}
          onHiding={() => setShowIm(false)}
          showCloseButton={true}
          width={"auto"}
        >
          <div
            style={{ float: "left", display: "inline-block", padding: "25px" }}
          >
            <img
              width={"200px"}
              src={`data:image/png;base64, ${base}`}
              alt="Товар"
            />
          </div>

          <div style={{ float: "left", display: "inline-block" }}>
            <DataGrid
              dataSource={curTable}
              width={500}
              // columnAutoWidth={true}
            />
          </div>
        </Popup>
      )}
      {isOrders && (
        <>
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                setisOrders(false);
                setSelected();
                setMy_id();
                orderId.current = null;
                number.current = null;
              }}
            />{" "}
          </div>
          <DataGrid
            dataSource={orders}
            onSelectionChanged={onSelection}
            // keyExpr={"id"}
          >
            <Selection mode="single" />
            <Column dataField="dateCreate" caption="Дата создания" />
            <Column dataField="shopName" caption="Магазин" />
            <Column dataField="number" caption="Номер" />
            <Column dataField="comment" caption="Комментарий" />
            <Column
              dataField="totalPrice"
              caption="Сумма"
              format={FormatCurrency}
            />
            <Column dataField="count" caption="Количество" />
            <Column dataField="dateSend" caption="Дата отправки" />
            <Column dataField="eMailSend" caption="Почта" />
            <MasterDetail
              enabled={true}
              autoExpandAll={false}
              component={MasterDetailView}
            />
            <Toolbar>
              <Item name="groupPanel" locateInMenu="auto" />
              <Item location="before">
                <Button
                  icon="copy"
                  // text="Создать"
                  onClick={addOrder}
                />
              </Item>
              <Item location="before">
                <Button
                  icon="email"
                  // text="Создать"
                  // onClick={sendMail}
                  disabled={!orderId.current}
                  onClick={() => setShowEmailPopUp(true)}
                />
              </Item>
            </Toolbar>
          </DataGrid>
        </>
      )}
      {showEmailPopUp && (
        <EmailPopUp
          comment={comm}
          shopId={shop}
          vendorId={vendorId}
          setIsIEmailSave={setShowEmailPopUp}
          orderId={orderId.current}
          number={number.current}
        />
      )}
      {!isOrders && (
        <>
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                if (!isCart) setIsPricelist(false);
                else setIsCart(false);
              }}
            />
          </div>
          {isCart && (
            <>
              <div style={{}}>
                <div className="dx-field">
                  <div
                    className="dx-field-label"
                    style={{ textAlign: "right" }}
                  >
                    Магазин:
                  </div>
                  <div className="dx-field-value">
                    <SelectBox
                      displayExpr="name"
                      valueExpr={"id"}
                      items={
                        shops &&
                        shops.map((el) => ({ name: el.name, id: el.id }))
                      }
                      //  defaultValue={companyName}
                      onValueChanged={(e) => {
                        console.log(e.value);
                        setShop(e.value);
                      }}
                      // value={addInfo}
                      // onValueChanged={(e) => setAddInfo(e.value)}
                    />
                  </div>
                </div>
                <div className="dx-field">
                  <div
                    className="dx-field-label"
                    style={{ textAlign: "right" }}
                  >
                    Комментарий:
                  </div>
                  <div className="dx-field-value">
                    <TextBox
                      value={comm}
                      onValueChanged={(e) => setComm(e.value)}
                    />
                  </div>
                </div>
                <div className="dx-field">
                  {/* <div
                    className="dx-field-label"
                    style={{ textAlign: "right" }}
                  >
                    Сохранить и отправить заказ на электронную почту поставщика
                  </div> */}
                  <div className="dx-field-value">
                    <CheckBox
                      defaultValue={false}
                      text={
                        "Сохранить и отправить заказ на электронную почту поставщика"
                      }
                      onValueChanged={(e) => {
                        console.log(e);
                        setCheckbox(e.value);
                      }}
                    />
                    {checkbox && isEmailSave && (
                      <EmailPopUp
                        shopId={shop}
                        vendorId={vendorId}
                        orderId={res.id}
                        number={res.number}
                        comment={comm}
                        setIsIEmailSave={setIsIEmailSave}
                      />
                    )}
                  </div>
                </div>
                <Button text="Сохранить корзину" onClick={saveCart} />
              </div>
              <DataGrid
                dataSource={cart}
                onRowUpdated={onChange}
                onRowRemoved={onRemove}
                keyExpr="id"
              >
                <Editing
                  mode="cell"
                  allowUpdating={true}
                  allowDeleting={true}
                />
                <Column
                  dataField="name"
                  caption="Название"
                  allowUpdating="false"
                />
                <Column
                  dataField="price"
                  caption="Цена"
                  dataType="number"
                  format={FormatCurrency}
                />
                <Column
                  dataField="order_quant"
                  caption="Количество"
                  dataType="number"
                />
                <Column
                  dataField="sum"
                  caption="Сумма"
                  dataType="number"
                  format={FormatCurrency}
                />
              </DataGrid>
            </>
          )}
          {!loading && !isCart && (
            <div id="grid">
              <DataGrid
                id="price-grid"
                className="planning-grid"
                height="100%"
                dataSource={reloadpricelist}
                keyExpr="id"
                columnAutoWidth={true}
                showBorders={true}
                focusedRowEnabled={true}
                onRowPrepared={rowPrepared}
                selectedRowKeys={selectedItemKeys}
                onSelectionChanged={mult ? onMulChange : onSelectionChanged}
                defaultColumns={columnsPL}
                allowColumnResizing={true}
                allowColumnReordering={true}
                onRowDblClick={showImage}
                ref={dataGrid}
                onInitialized={onInitialized}

                // repaintChangesOnly={true}
              >
                <HeaderFilter visible="true" />
                <Sorting mode="single" />
                {mult ? (
                  <Selection
                    mode="multiple"
                    selectAllMode={allMode}

                    // showCheckBoxesMode={checkBoxesMode}
                  />
                ) : (
                  <Selection mode="single" />
                )}
                <Paging enabled={true} />
                <Grouping contextMenuEnabled={true} />
                <LoadPanel enabled={false} />
                <GroupPanel visible={true} />
                <SearchPanel
                  visible={true}
                  width={400}
                  placeholder="Поиск номенклатуры..."
                />
                <Scrolling columnRenderingMode="virtual" />
                {columnsPL.map((el) => (
                  <Column {...el} />
                ))}
                <Toolbar>
                  <Item name="groupPanel" locateInMenu="auto" />
                  <Item location="before">
                    <div className="toolbar-separator"></div>
                  </Item>
                  <Item location="before">
                    <Button
                      icon="plus"
                      // text="Создать"
                      onClick={onClickPlus}
                    />
                  </Item>
                  <Item location="before">
                    <Button
                      icon="minus"
                      // text="Изменить"
                      onClick={(e) => {
                        onClickMinus(e);
                      }}
                    />
                  </Item>
                  <Item location="before">
                    {cart && (
                      <Button
                        disabled={!count}
                        icon="cart"
                        text={"Корзина" + (count ? `[${count}]` : "")}
                        onClick={() => {
                          showCart();
                        }}
                      />
                    )}
                  </Item>
                  <Item location="before">
                    <div className="toolbar-separator"></div>
                  </Item>
                  <Item location="before">
                    <Button
                      icon="ordersbox"
                      text="Заказы"
                      onClick={() => {
                        showOrders();
                      }}
                    />
                  </Item>
                  <Item location="before">
                    <div className="toolbar-separator"></div>
                  </Item>
                  <Item location="before">
                    <CheckBox value={mult} onValueChanged={onValueChanged} />
                  </Item>
                  <Item location="before">
                    <Button
                      // icon="minus"
                      text="Категории"
                      disabled={!mult}
                      onClick={showMain}
                    />
                  </Item>
                  <Item location="after">
                    <Button icon="refresh" onClick={refreshData} />
                  </Item>
                  <Item location="before">
                    <div className="toolbar-separator"></div>
                  </Item>
                  <Item name="searchPanel" locateInMenu="auto" />
                </Toolbar>
              </DataGrid>
            </div>
          )}
        </>
      )}
    </div>
  );
}
