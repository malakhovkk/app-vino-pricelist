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
import {
  createContact,
  getContacts,
  getGroups,
  getVendors,
} from "../../restApi/index";
import { Grid } from "devextreme-react/cjs/chart";
import { Sorting } from "devextreme-react/data-grid";
import { Col } from "devextreme-react/cjs/responsive-box";
import { Toolbar } from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { TagBox, TextArea } from "devextreme-react";
import { Selection } from "devextreme-react/data-grid";
import DateBox, { DateBoxTypes } from "devextreme-react/date-box";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import { saveContactChanges } from "../../restApi/index";
import DataGridContacts from "../DataGridContacts";
import { Item } from "devextreme-react/data-grid";
import useStore from "../../zustand";
import SelectBox from "devextreme-react/select-box";
import { createUser } from "../../restApi/index";
import notify from "devextreme/ui/notify";
import { createGroups } from "../../restApi/index";
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
      !user.name ||
      !user.login ||
      !user.password ||
      !user.email ||
      !user.id ||
      !group
    )
      return;
    console.log(user);
    console.log(group);
    let user2 = {
      name: user.name,
      email: user.email,
      login: user.login,
      password: user.password,
      companyId: user.id,
    };
    let r = await createUser(user2);
    console.warn(r);
    const res = r.result;
    await createGroups(res, group);
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
  const [groups, setGroups] = useState();
  // useEffect(() => {
  //   // if (contactInfo["contact"]) {
  //   setContactInfo({ ...contactInfo, name: "", contact: "", type: "" });
  //   // }
  // }, [createPopUp]);
  const data = [
    { name1: "login", dataCaption: "Логин" },
    { name1: "name", dataCaption: "Имя пользвователя" },
    { name1: "email", dataCaption: "Электронная почта" },
    { name1: "password", dataCaption: "Пароль" },
  ];
  useEffect(() => {
    async function exec() {
      const v = await getVendors();
      const groups = await getGroups();
      setVendors(v.map((el) => ({ name: el.name, companyId: el.id })));
      setGroups(groups);
    }
    exec();
  }, []);
  const [group, setGroup] = useState();
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
      height="600px"
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
          <div className="dx-field-label">Группа пользвователя:</div>
          <div className="dx-field-value">
            <TagBox
              items={groups}
              // value={group?.id}
              valueExpr={"id"}
              displayExpr={"name"}
              onValueChanged={(e) => {
                console.log(e.value);
                setGroup(e.value);
              }}
              //   inputAttr={simpleProductLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Компания:</div>
          <div className="dx-field-value">
            <SelectBox
              items={
                vendors &&
                vendors.map((el) => ({ name: el.name, id: el.companyId }))
              }
              value={user?.id}
              valueExpr={"id"}
              displayExpr={"name"}
              onValueChanged={(e) => {
                console.log(e.value);
                setUser({ ...user, id: e.value });
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
