import { useCallback, useEffect } from "react";
import useStore from "../zustand";
import { getContacts, getPricelist, GetStocks } from "../new_api";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  FilterRow,
  LoadPanel,
} from "devextreme-react/data-grid";
import { Sorting } from "devextreme-react/data-grid";
import { Selection } from "devextreme-react/data-grid";
import { Item } from "devextreme-react/data-grid";
import { Toolbar } from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import { useState } from "react";
import axios from "axios";
import { Scrolling } from "devextreme-react/data-grid";
import Pricelist from "../pages/pricelist/pricelist";
function PriceList2() {
  return (
    <>
      <h2 className={"content-block"}>Прайс-Лист</h2>
      <DataGrid
        keyExpr="id"
        className="grid theme-dependent"
        focusedRowEnabled={true}
        noDataText="нет данных"
      >
        <Paging enabled={false} />
        <Column dataField="name" caption="Имя" />
        <Column dataField="contact" caption="Контакт" />
        <Column dataField="type" caption="Тип" />
        <LoadPanel enabled={true} />
        <Selection mode="single" />
      </DataGrid>
    </>
  );
}

export default function MainTable({ mainTable }) {
  const {
    setContactPopUp,
    setShowPopUp,
    setCreatePopUp,
    setContactInfo,
    contactPopUp,
    setVendorId,
    vendorId,
    contacts,
    setContactId,
    setContacts,
    isPricelist,
    setIsPricelist,
    pricelist,
    setPricelist,
  } = useStore();

  const onSelectionChanged = useCallback((e) => {
    // alert(1);
    console.log(e);
    // setShowPopUp(true);
    setVendorId(e.selectedRowKeys[0]);
    // getContacts(e.selectedRowKeys[0]);
  }, []);

  const showPopUpWithContacts = async () => {
    const cs = await getContacts(vendorId);
    // if (cs.length === 0) return;
    console.log(cs);
    if (cs.length !== 0) setContactId(cs[0].id);
    setContacts(cs);
    setShowPopUp(true);
  };

  const [p, setP] = useState(false);
  // const [pricelist, setPricelist] = useState([]);
  const [stocks, setShops] = useState([]);

  const onClickPriceList = async (e) => {
    console.log(vendorId);
    setShops(await GetStocks());
    setPricelist(await getPricelist(vendorId));
    setIsPricelist(true);
  };
  console.log(is1C);
  return (
    <>
      {/* <Button>2</Button> */}
      <Pricelist />
      {!isPricelist && (
        <DataGrid
          className={"dx-card wide-card"}
          dataSource={mainTable}
          // keyExpr - важный параметр, через него идет связывание событий
          keyExpr="id"
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          width="100%"
          // onFocusedRowChanged={onFocusedRowChanged}
          onSelectionChanged={onSelectionChanged}
        >
          <Column dataField="name" caption="Имя" />
          <Column dataField="code" caption="Код" />
          <Column dataField="info" caption="Инфо" />
          <Column dataField="profile" caption="Профайл" />
          <Sorting mode="single" />
          <Selection mode="single" />
          <Paging enabled={false} />
          <LoadPanel enabled={true} />
          <SearchPanel visible={true} width={340} placeholder="Поиск..." />

          {/* Кнопочки на панели  */}
          <Toolbar>
            <Item location="before" name="searchPanel" locateInMenu="auto" />
            <Item location="before">
              <div className="toolbar-separator"></div>
            </Item>
            <Item location="before">
              <Button
                icon="card"
                text="Контакты"
                onClick={showPopUpWithContacts}
              />
            </Item>
            <Item location="before">
              <Button
                icon="group"
                text="Прайс-лист"
                onClick={onClickPriceList}
              />
            </Item>
          </Toolbar>
        </DataGrid>
      )}
    </>
  );
}
