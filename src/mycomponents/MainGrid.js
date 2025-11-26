import { useCallback, useEffect } from "react";
import useStore from "../zustand";
import { getContacts, getPricelist, GetStocks } from "../restApi/index";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  FilterRow,
  LoadPanel,
} from "devextreme-react/data-grid";
import "./MainGrid.css";

//https://svgicons.com/icon-set/file-svg-icons?page=17
import * as item1C from "./item1C.svg";

import { Sorting } from "devextreme-react/data-grid";
import { Selection } from "devextreme-react/data-grid";
import { Item } from "devextreme-react/data-grid";
import { Toolbar } from "devextreme-react/data-grid";
import Button from "devextreme-react/button";

import { useState } from "react";
import axios from "axios";
import { Scrolling } from "devextreme-react/data-grid";
import Pricelist from "../pages/pricelist/pricelist";
import ProfileMain from "./ProfileMain";
import { Page1C } from "../pages/1C/Page1C";
import { CheckBox } from "devextreme-react/check-box";
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

export default function MainTable({ mainTable, setIsUpload }) {
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
    is1C,
    setIs1C,
    setPricelist,
    setIsProfile,
    isProfile,
    rowIndex,
    setRowIndex,
  } = useStore();

  // const onValueChanged = (e) => {
  //   if (e.value) {
  //     setMult(true);
  //   } else {
  //     setMult(false);
  //   }
  // };

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
    // setShops(await GetStocks());
    // setPricelist(await getPricelist(vendorId));
    setIsPricelist(true);
  };
  const onClickProfile = async (e) => {
    console.log(vendorId);
    // setShops(await GetStocks());
    // setPricelist(await getPricelist(vendorId));
    setIsProfile(true);
  };
  const setAll = () => {
    setIsProfile(false);
    setIsPricelist(false);
  };
  const onClick1C = () => {
    setIs1C(true);
  };
  // const [mult, setMult] = useState(false);
  // const [rowIndex, setRowIndex] = useState(0);
  return (
    <>
      {/* <Button>2</Button> */}
      {isProfile && <ProfileMain vendorId={vendorId} setAll={setAll} />}
      {isPricelist && <Pricelist vendorId={vendorId} />}
      {is1C && <Page1C vendorId={vendorId} />}
      {!isPricelist && !isProfile && !is1C && (
        <DataGrid
          className={"dx-card wide-card"}
          dataSource={mainTable}
          // keyExpr - важный параметр, через него идет связывание событий
          keyExpr="id"
          focusedRowEnabled={true}
          focusedRowIndex={rowIndex}
          // defaultFocusedRowIndex={0}
          width="100%"
          onRowClick={(e) => {
            setVendorId(e.data.id);
            console.log(e);
            setRowIndex(e.rowIndex);
          }}
          // onFocusedRowChanged={onFocusedRowChanged}
          onSelectionChanged={onSelectionChanged}
        >
          <Column dataField="name" caption="Имя" />
          <Column dataField="code" caption="Код" />
          <Column dataField="info" caption="Инфо" />
          <Column dataField="profile" caption="Профайл" />
          <Sorting mode="single" />
          {/* {mult ? (
            <Selection
              mode="multiple"
              // selectAllMode={allMode}
              // showCheckBoxesMode={checkBoxesMode}
            />
          ) : (
            <Selection mode="single" />
          )} */}
          <Paging enabled={false} />
          <LoadPanel enabled={true} />
          <SearchPanel
            visible={true}
            width={340}
            placeholder="Поиск поставщика ..."
          />

          {/* Кнопочки на панели  */}
          <Toolbar>
            <Item location="before" name="searchPanel" locateInMenu="auto" />
            <Item location="before">
              <div className="toolbar-separator"></div>
            </Item>
            <Item location="before">
              <Button
                icon="datafield"
                text="Прайс-лист"
                onClick={onClickPriceList}
              />
            </Item>
            <Item location="before">
              <Button
                //icon="https://vinopark.ru/images/pricelist/item1C.svg"
                icon="https://vinopark.ru/images/pricelist/item1C2.png"
                text="Номенклатура"
                hint="Номенклатура поставщика из 1c"
                onClick={onClick1C}
              />
            </Item>
            <Item location="before">
              <div className="toolbar-separator"></div>
            </Item>
            <Item location="before">
              <Button
                icon="user"
                hint="Контакты поставщика"
                onClick={showPopUpWithContacts}
              />
            </Item>
            <Item location="alter">
              <Button
                icon="doc"
                hint="Профили загрузки прайс-листов"
                onClick={onClickProfile}
              />
            </Item>
            <Item location="alter">
              <Button text="Загрузить" onClick={() => setIsUpload(true)} />
            </Item>
          </Toolbar>
        </DataGrid>
      )}
    </>
  );
}
