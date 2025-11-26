import React, { useCallback, useEffect, useState } from "react";
import "./profile.scss";
import Form from "devextreme-react/form";
import response from "./response";
// import { shops } from "./shops";
// import * as pricelist from "./response.json";
// import * as shops from "./shops.json";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  FilterRow,
  LoadPanel,
} from "devextreme-react/data-grid";
import axios from "axios";
import { ModifiedColumns } from "../../project/utils/functions";
import { ModifiedPriceList } from "../../project/utils/functions";
import {
  createContact,
  getContacts,
  getProfiles,
  getVendors,
} from "../../restApi/index";
import { Grid } from "devextreme-react/cjs/chart";
import { Sorting } from "devextreme-react/data-grid";
import { Col } from "devextreme-react/cjs/responsive-box";
import { Toolbar } from "devextreme-react/data-grid";

import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { TextArea } from "devextreme-react";
import { Selection } from "devextreme-react/data-grid";
import DateBox, { DateBoxTypes } from "devextreme-react/date-box";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import { saveContactChanges } from "../../restApi/index";
import DataGridContacts from "../../mycomponents/DataGridContacts";
import { Item } from "devextreme-react/data-grid";
import useStore from "../../zustand";
import ContactPopUp from "../../mycomponents/popups/ContactPopUp";
import MainGrid from "../../mycomponents/MainGrid";
import CreatePopUp from "../../mycomponents/popups/CreatePopUp";
import { Button, SelectBox } from "devextreme-react";
import { getPartners, loadExcel } from "../../restApi/Api1c";
import { XMLParser } from "fast-xml-parser";
import { saveExcel } from "../../restApi/Api1c";
import { ToastContainer, toast } from "react-toastify";
import notify from "devextreme/ui/notify";
import { confirm, custom, DialogTypes } from "devextreme/ui/dialog";

export default function Profile() {
  const [mainTable, setMainTable] = useState([]);
  // const [showPopUp, setShowPopUp] = useState(false);
  const [addInfo, setAddInfo] = useState("");
  // const [vendorId, setVendorId] = useState("");
  const [contacts, setContacts] = useState([]);
  const [file, setFile] = useState();
  const [num, setNum] = useState(0);
  const [excelData, setExcelData] = useState([]);
  const [profileShow, setShowProfile] = useState(false);
  const [excelPure, setExcelPure] = useState();
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
    formData.append("filename", file);
    formData.append("num", num);
    try {
      const response = await loadExcel(formData);
      console.log(response);
      if (response.message) {
        return notify(response.message);
      }
      // const jsonResult = convert.xml2json(response);

      // setExcelData(jsonResult.pricelist.row);
      const parser = new XMLParser();
      const jsonObj = parser.parse(response);
      setExcelPure(response);
      setExcelData(jsonObj.pricelist.row);
      setShowProfile(true);
      console.log(jsonObj);
    } catch (err) {
      console.log(err);
      // notify(err.message);
    }
  };
  // const [showPopUp, vendorId] = useStore();
  const {
    setContactPopUp,
    setCreatePopUp,
    setContactInfo,
    contactInfo,
    contactPopUp,
    createPopUp,
    setVendorId,
    setShowPopUp,
    showPopUp,
    vendorId,
    rowIndex,
  } = useStore();
  // const [contactPopUp, setContactPopUp] = useState(false);
  const [contactId, setContactId] = useState("");
  const [partners, setPartners] = useState();
  const [partner_uid, setPartnerUID] = useState();
  const vendorChange = async (e) => {
    setPartnerUID(e.value);
    setProfile();
    setProfiles(await getProfiles(e.value));
  };
  // const [contactInfo, setContactInfo] = useState({});

  const customizeColumns = (columns) => {
    console.log("columns=", columns);
    //columns[0].width = 100;
    //columns[1].width = 210;
  };

  console.log("showPopUp = ", showPopUp);
  console.log(contactInfo);
  useEffect(() => {
    async function get_all() {
      const r = await getVendors();
      console.log(r);
      if (!r) return;
      setVendorId(r[rowIndex].id);
      setMainTable(
        r.map((el) => ({
          id: el.id,
          name: el.name,
          code: el.code,
          info: el.info,
          profile: el?.profile?.name,
        }))
      );
    }
    get_all();
  }, []);

  const onSelectionChanged = useCallback((e) => {
    // alert(1);
    console.log(e);
    // setShowPopUp(true);
    setVendorId(e.selectedRowKeys[0]);
    // getContacts(e.selectedRowKeys[0]);
  }, []);
  // ;
  // const onFocusedRowChanged = useCallback((e) => {
  //   console.log(e);
  //   setShowPopUp(true);
  //   setVendorId(e.row.data.id);

  //   // e.row.data;
  // }, []);
  const showPopUpWithContacts = async () => {
    const cs = await getContacts(vendorId);
    // if (cs.length === 0) return;
    console.log(cs);
    if (cs.length !== 0) setContactId(cs[0].id);
    setContacts(cs);
    setShowPopUp(true);
  };
  const [profiles, setProfiles] = useState();
  const [isUpload, setIsUpload] = useState(false);
  useEffect(() => {
    (async function () {
      setPartners(await getVendors());
      setProfiles(await getProfiles(vendorId));
    })();
  }, []);
  useEffect(() => {
    (async function () {
      setProfiles(await getProfiles(vendorId));
    })();
  }, [isUpload]);
  console.log(vendorId);
  console.log(profiles);
  const getInfoButtonOptions = {
    text: "More info",
    // onClick: showMoreInfo,
  };
  // useEffect(() => {
  //   setContactInfo({ contact: "", name: "", type: "" });
  // }, []);
  const onSelectionChangedContacts = useCallback((e) => {
    setContactId(e.selectedRowKeys[0]);
  }, []);

  const saveChanges = () => {
    saveContactChanges(contactInfo);
  };

  let fileHandle;
  const openFolder = async () => {
    try {
      [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const content = await file.text();
      // setFileName(file.name);
      setFile(file);
      // console.log(content);
      console.log(file);
      console.log(fileHandle);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("contactInfo = ", contactInfo);
  // const [createPopUp, setCreatetPopUp] = useState();
  const [newContact, setNewContact] = useState({});
  const createContactE = () => {
    createContact({ id: "", vendorId, ...newContact });
  };
  console.log("vendorId=", vendorId);
  console.warn(contacts);

  const [profile, setProfile] = useState();
  const [columnsProfile, setColumnsProfile] = useState([]);
  const [columnsExcel, setColumnsExcel] = useState([]);
  const [isShowProfile, setIsShowProfile] = useState(false);
  const showProfile = () => {
    setIsShowProfile((profile) => !profile);
  };

  const profileChange = (e) => {
    console.log(">>>");
    setProfile(e.value);
    let res = [];
    let found = profiles.find((el) => e.value === el.id);
    console.log(found);
    if (!found) return;
    console.log(profiles.find((el) => e.value === el.id).columns);
    let clms = [];
    for (let i = 0; i < found.columns.length; i++) {
      console.log(found.columns[i]);
      res.push({
        pos: found.columns[i].position,
        val: found.columns[i].name,
        json: found.columns[i].code,
      });
      // clms.push(
      //   <Column
      //     dataField={`col${found.columns[i].position}`}
      //     caption={`col ${found.columns[i].position} ${found.columns[i].name}`}
      //   />
      // );
      // res[`col ${found.columns[i].position}`]found.columns[i].name;
    }
    let arr = [];
    for (let i = 0; i < found.columns.length; i++) {
      let pos = found.columns[i].position;
      console.log(arr.findIndex((el) => el.pos === pos));
      if (arr.findIndex((el) => el.pos === pos) !== -1) {
        arr[arr.findIndex((el) => el.pos === pos)].val +=
          ", " + found.columns[i].name;
      } else {
        arr.push({
          pos: found.columns[i].position,
          val: found.columns[i].name,
          code: found.columns[i].code,
        });
      }
    }
    console.log(arr);
    let arr1 = [];
    for (let i = 0; i < arr.length; i++) {
      arr1.push({
        col: `${arr[i].pos}`,
        value: `${arr[i].val}`,
        code: `${arr[i].code}`,
      });
    }
    clms.push(
      <Column
        dataField={"col0"}
        fixed={true}
        caption={"Номер"}
        width={"auto"}
      />
    );
    for (let i = 0; i < arr.length; i++) {
      clms.push(
        <Column caption={`${arr[i].pos}`}>
          <Column
            dataField={`col${arr[i].pos}`}
            caption={`${arr[i].val}`}
            width={"auto"}
          />
        </Column>
      );
    }
    let res2 = [];
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; ; j++) {
        if (res2[j] && res2[j][`col ${res[i].pos}`]) continue;
        else {
          res2[j] = { ...res2[j], [`col ${res[i].pos}`]: res[i].val };
          break;
        }
      }
    }
    setColumnsExcel(clms);

    console.log(res2);
    setColumnsProfile(arr1);
    // setIsShowProfile(true);
  };

  const save = async () => {
    const res = await saveExcel({
      vendorId,
      profileId: profile,
      document: excelPure,
      fileName: file.name,
    });
    console.log("save.res >>>", res);
    if (res.status !== 200) {
      //alert("3232", "11111111111111");
      let textInfo = res?.response?.data?.Error
        ? `<b>${res?.response?.data?.Error[0]}</b>`
        : `<b>${res?.response?.data?.message}</b>`;
      console.log("save.textInfo >>>", textInfo);
      let myDialog = custom({
        title: "error",
        messageHtml: textInfo,
        buttons: [
          {
            text: "OK",
            onClick: (e) => {
              return { buttonText: e.component.option("text") };
            },
          },
        ],
      });
      myDialog.show();
      //confirm("<i>Are you sure?</i>", "Confirm changes");
      //notify(res.response.data.message, "error", res.response.data.code);
      return;
    }
    notify(res?.response?.data?.message + " " + res?.response?.data?.result);
  };
  //console.log(excelData);

  return (
    <>
      <ToastContainer />
      {!isUpload && (
        <>
          <ContactPopUp />
          <CreatePopUp />
        </>
      )}
      <h2 className={"content-block"}>Поставщики</h2>
      {isUpload && (
        <>
          <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <Button
              icon="back"
              id="icon-disabled-back"
              onClick={() => {
                setIsUpload(false);
                setFile();
                setExcelData();
                setColumnsProfile();
                setColumnsExcel();
                setColumnsProfile();
                // setData();
              }}
            />{" "}
          </div>
          {isShowProfile && (
            <Popup
              onHiding={() => {
                setIsShowProfile(false);
              }}
              visible={isShowProfile}
              title={`Профайл`}
              showCloseButton={true}
              position="center"
              width="500px"
              height="500px"
            >
              <DataGrid dataSource={columnsProfile} />
            </Popup>
          )}
          <DataGrid
            dataSource={excelData}
            columnAutoWidth={true}
            allowColumnResizing={true}
            showBorders={true}
            columnResizingMode={"widget"}
            height="100%"
            width="auto"
          >
            {columnsExcel}
            <Selection mode="single" />
            <Toolbar>
              <Item location="before">
                <input type="file" name="upload" onChange={handleFileChange} />
              </Item>
              <Item
                location="before"
                text={file?.name || "файл не выбран"}
                //className="informer"
                width={10}
              ></Item>
              <Item location="before">
                <div className="toolbar-separator"></div>
              </Item>
              <Item location="before">
                <SelectBox
                  items={[0, 1, 2, 3, 4]}
                  onValueChanged={(e) => setNum(e.value)}
                  defaultValue={0}
                />
              </Item>
              <Item location="before">
                <Button
                  icon="upload"
                  text="Отправить"
                  onClick={handleUploadClick}
                  disabled={!file}
                />
              </Item>
              <Item location="before">
                <SelectBox
                  placeholder="Выберите профайл"
                  dataSource={profiles}
                  displayExpr="name"
                  // defaultValue={profile}
                  searchEnabled={true}
                  searchMode={"contains"}
                  width={"600px"}
                  onValueChanged={profileChange}
                  showClearButton={true}
                  // inputAttr={templatedProductLabel}
                  valueExpr="id"
                  // defaultValue={partners[0].uid}
                />
              </Item>
              <Item location="before">
                <Button
                  text={!isShowProfile ? "Показать профайл" : "Скрыть профайл"}
                  onClick={showProfile}
                  disabled={!profile}
                />
              </Item>
              <Item location="before">
                <Button
                  icon="save"
                  text="Сохранить"
                  onClick={save}
                  disabled={!profile}
                />
              </Item>
            </Toolbar>
          </DataGrid>
        </>
      )}
      {!isUpload && (
        <>
          <Popup
            onHiding={() => {
              setShowPopUp(false);
            }}
            visible={showPopUp}
            title={`Контакты`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="500px"
          >
            <div className="view crm-deals-list">
              <div className="view-wrapper view-wrapper-deals-list list-page">
                <DataGridContacts contacts={contacts} />
              </div>
            </div>
          </Popup>
          <MainGrid mainTable={mainTable} setIsUpload={setIsUpload} />
        </>
      )}
    </>
  );
}
