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
  getGroupsByUserid,
  getVendors,
} from "../../restApi/index";
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
import { saveContactChanges } from "../../restApi/index";
import DataGridContacts from "../DataGridContacts";
import { Item } from "devextreme-react/data-grid";
import useStore from "../../zustand";
import SelectBox from "devextreme-react/select-box";
import { TagBox } from "devextreme-react";
import { createUser } from "../../restApi/index";
import notify from "devextreme/ui/notify";
import {
  editUser,
  addUserToGroup,
  deleteUserFromGroup,
} from "../../restApi/index";
export default function UserEditPopUp({ data2 }) {
  const [groups, setGroups] = useState();
  const [APIgroups, setAPIgroups] = useState();
  const [curG, setCurG] = useState();
  useEffect(() => {
    (async () => {
      if (data2) {
        let cur = await getGroupsByUserid(data2.id);
        setAPIgroups(cur.map((el) => el.id));
        setUser({ ...user, groups: cur.map((el) => el.id) });
      }
    })();
  }, [data2]);
  useEffect(() => {
    (async () => {
      setGroups(await getGroups());
    })();
  }, []);
  const { id, name, login, email, companyId, companyName } = data2;
  console.log(name, login, email, companyId);
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
    console.log(user);
    if (
      !user.login ||
      !user.name ||
      // !user.password ||
      !user.email ||
      !user.companyId
    )
      return;
    delete user["companyName"];
    // const id = vendors.find((v) => v.name === user.companyName).id;
    // console.log(id);
    let g = user["groups"];
    // await addUserToGroup(g.map((el) => ({ groupId: el, userId: user.id })));

    let toAddGroups = [];
    let toDeleteGroups = [];
    console.log("user.groups = ", user.groups, "APIgroups = ", APIgroups);
    user.groups.forEach((group) => {
      if (!APIgroups.find((el) => el === group)) {
        toAddGroups.push(group);
      }
    });
    APIgroups.forEach((el) => {
      if (!user.groups.find((group) => el === group)) {
        toDeleteGroups.push(el);
      }
    });

    // await addUserToGroup(toAddRights);
    // await deleteUserFromGroup(toDeleteGroups);

    // console.log(selected, APIrights);
    console.log(toDeleteGroups, toAddGroups);
    await deleteUserFromGroup(
      toDeleteGroups.map((el) => ({
        userId: user.id,
        groupId: el,
      }))
    );
    await addUserToGroup(
      toAddGroups.map((el) => ({
        userId: user.id,
        groupId: el,
      }))
    );

    delete user["groups"];
    const res = await editUser(user);
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
      setUserEditPopUp(false);
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
    setUserEditPopUp,
  } = useStore();
  const [user, setUser] = useState({
    id,
    name,
    login,
    email,
    password: "",
    companyId,
    companyName,
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
      let v;
      try {
        v = await getVendors();
      } catch (e) {
        console.log(e);
      }
      if (v) setVendors(v.map((el) => ({ name: el.name, id: el.id })));
    }
    exec();
  }, []);
  console.log(data);
  console.warn(companyId);
  console.log(vendors);
  let vendors2 = vendors;
  if (vendors)
    vendors2 = [
      ...vendors,
      {
        id: "e419c34f-6856-11ea-8298-001d7dd64d88",
        name: `Общество с ограниченной ответственностью "ВИНОПАРК"`,
      },
    ];
  if (vendors2 && companyId)
    console.warn(vendors2.find((el) => el.id === companyId).name);
  const [selectedValue, setSelectedValue] = useState(
    companyId ? companyId : ""
  );
  console.log(user);
  return (
    <Popup
      onHiding={() => {
        setUserEditPopUp(false);
      }}
      visible={UserEditPopUp}
      title={`Редактирование пользователя`}
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
          <div className="dx-field-label">Группы пользвователя:</div>
          <div className="dx-field-value">
            <TagBox
              items={groups}
              // value={group?.id}
              valueExpr={"id"}
              displayExpr={"name"}
              onValueChanged={(e) => {
                console.log(e.value);
                setUser({ ...user, groups: e.value });
              }}
              value={user.groups}
              //   inputAttr={simpleProductLabel}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Компания:</div>
          <div className="dx-field-value">
            <SelectBox
              dataSource={
                vendors2 &&
                vendors2.map((el) => ({
                  name: el.name,
                  id: el.id,
                }))
              }
              // defaultValue={"123"}
              value={
                selectedValue
                // vendors2 && vendors2.find((el) => el.id === user.companyId).id
              }
              displayExpr="name"
              valueExpr="id"
              onValueChanged={(e) => {
                console.log(e);
                console.log(e.value);
                setSelectedValue(e.value);
                setUser({ ...user, companyId: e.value });
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
      <Button text="Сохранить" onClick={saveChanges} />
    </Popup>
  );
}
