import React, { useCallback, useEffect, useState } from "react";
import Form from "devextreme-react/form";

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
import { createContact, getContacts, getVendors } from "../../new_api";
import { Grid } from "devextreme-react/cjs/chart";
import { Sorting } from "devextreme-react/data-grid";
import { Col } from "devextreme-react/cjs/responsive-box";
import { Toolbar } from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { TextArea } from "devextreme-react";
import { Selection } from "devextreme-react/data-grid";
import DateBox, { DateBoxTypes } from "devextreme-react/date-box";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import { saveContactChanges } from "../../new_api";
import DataGridContacts from "../DataGridContacts";
import { Item } from "devextreme-react/data-grid";
import useStore from "../../zustand";
import SelectBox from "devextreme-react/select-box";
import { createUser } from "../../new_api";
import notify from "devextreme/ui/notify";
export default function UserCreatePopUp() {
  const { vendorId, setContacts } = useStore();
  // const [myContact, setMyContact] = useState({
  //   name: "",
  //   contact: "",
  //   type: "",
  // });
  const typeS = {
    телефон: 1,
    почта: 2,
  };
  const saveChanges = async () => {
    if (
      !user.login ||
      !user.name ||
      !user.password ||
      !user.email ||
      !user.companyName
    )
      return;
    const id = vendors.find((v) => v.name === user.companyName).companyId;
    console.log(id);
    const res = await createUser({ ...user, companyId: id });
    if (res) {
      notify(
        {
          message: "Успешно!",
          width: 230,
          position: {
            at: "bottom",
            my: "bottom",
            of: "#container",
          },
        },
        "success",
        800
      );
      setUserCreatePopUp(false);
    }
    // const cs = await getContacts(vendorId);
    // // if (cs.length === 0) return;
    // console.log(cs);
    // setContacts(cs);
  };
  const {
    setContactPopUp,
    setCreatePopUp,
    setContactInfo,
    contactInfo,
    contactPopUp,
    createPopUp,
    setNewContact,
    newContact,
    setUserCreatePopUp,
    userCreatePopUp,
  } = useStore();
  const [user, setUser] = useState({
    name: "",
    login: "",
    email: "",
    password: "",
    companyId: "",
    companyName: "",
  });
  const [vendors, setVendors] = useState();
  // useEffect(() => {
  //   // if (contactInfo["contact"]) {
  //   setContactInfo({ ...contactInfo, name: "", contact: "", type: "" });
  //   // }
  // }, [createPopUp]);
  const data = [
    { name1: "login", dataCaption: "Логин" },
    { name1: "name", dataCaption: "Тия пользвователя" },
    { name1: "email", dataCaption: "Электронная почта" },
    { name1: "password", dataCaption: "Пароль" },
  ];
  useEffect(() => {
    async function exec() {
      const v = await getVendors();
      setVendors(v.map((el) => ({ name: el.name, companyId: el.id })));
    }
    exec();
  }, []);
  return (
    <Popup
      onHiding={() => {
        setUserCreatePopUp(false);
      }}
      visible={userCreatePopUp}
      title={`Новый пользователь`}
      showCloseButton={true}
      position="center"
      width="500px"
      height="500px"
    >
      <div className="dx-fieldset">
        {data.map((el) => (
          <>
            <div className="dx-field">
              <div className="dx-field-label">{el.dataCaption}</div>
              <div className="dx-field-value">
                <TextBox
                  onValueChanged={(e) => {
                    console.log(e);
                    setUser({ ...user, [el.name1]: e.value });
                  }}
                  value={user[el.name1]}
                />
              </div>
            </div>
          </>
        ))}
        <div className="dx-field">
          <div className="dx-field-label">Компания:</div>
          <div className="dx-field-value">
            <SelectBox
              items={vendors && vendors.map((el) => el.name)}
              value={user?.companyName}
              onValueChanged={(e) => {
                console.log(e.value);
                setUser({ ...user, companyName: e.value });
              }}
              //   inputAttr={simpleProductLabel}
            />
          </div>
        </div>
      </div>
      {/* <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Логин:</div>
          <div className="dx-field-value">
            <TextBox
              onValueChanged={(e) => {
                console.log(e);
                setUser({ ...user, contact: e.value });
              }}
              // onChange={(e) => {
              //   console.log(e);
              //   setContactInfo({ ...contactInfo, contact: e.value });
              // }}
              value={user?.contact}
              // value={addInfo}
              // onValueChanged={(e) => setAddInfo(e.value)}
            />
          </div>
        </div> */}
      {/* <div className="dx-field">
          <div className="dx-field-label">Имя:</div>
          <div className="dx-field-value">
            <TextBox
              value={user?.name}
              onValueChanged={(e) => {
                console.log(e);
                setUser({ ...user, name: e.value });
              }}
              // value={addInfo}
              // onValueChanged={(e) => setAddInfo(e.value)}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Тип:</div>
          <div className="dx-field-value">
            <SelectBox
              items={["телефон", "почта"]}
              value={user?.type}
              onValueChanged={(e) => {
                console.log(e.value);
                setUser({ ...user, type: e.value });
              }}
              //   inputAttr={simpleProductLabel}
            />
            {/* <TextBox
              value={contactInfo["type"]}
              onValueChanged={(e) => {
                console.log(e);
                setContactInfo({ ...contactInfo, type: e.value });
              }}
              // value={addInfo}
              // onValueChanged={(e) => setAddInfo(e.value)}
            /> */}
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}
      <Button text="Создать контакт" onClick={saveChanges} />
    </Popup>
  );
}
