import React, { useEffect, useState } from "react";
import "devextreme/data/odata/store";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Lookup,
} from "devextreme-react/data-grid";
import { Selection } from "devextreme-react/data-grid";
import { Toolbar } from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import Button from "devextreme-react/button";
import {
  editGroups,
  getUsers,
  getRights,
  getRightsByGroupid,
} from "../../restApi/index";
import useStore from "../../zustand";
import UserCreatePopUp from "../../mycomponents/popups/UserCreatePopUp";
import UserEditPopUp from "../../mycomponents/popups/UserEditePopUp";
import { getGroups, deleteGroups, addGroups } from "../../restApi/index";
import { Popup, TagBox, TextBox } from "devextreme-react";
import { addRights, deleteRights } from "../../restApi/index";
// import { editGroups } from "../../restApi/index";

export default function Task() {
  const [users, setUsers] = useState();
  const [data, setData] = useState();
  const [groups, setGroups] = useState();
  const [rights, setRights] = useState();
  const {
    userCreatePopUp,
    setUserCreatePopUp,
    userEditPopUp,
    setUserEditPopUp,
  } = useStore();
  useEffect(() => {
    async function exec() {
      const users = await getUsers();
      if (users) {
        setUsers(users);
      }
    }
    exec();
  }, []);

  useEffect(() => {
    async function exec() {
      const groups = await getGroups();
      if (groups) {
        setGroups(groups);
      }
    }
    exec();
  }, []);
  useEffect(() => {
    async function exec() {
      const users = await getUsers();
      if (users) {
        setUsers(users);
      }
    }
    exec();
  }, [userCreatePopUp, userEditPopUp]);

  const onSelectionChanged = (e) => {
    console.log(e);
    setData(e.data);
    // setData(e.selectedRowsData[0]);
  };
  useEffect(() => {
    (async () => setRights(await getRights()))();
  }, []);
  useEffect(() => {
    if (!users) return;
    // alert();
    // setData();
  }, [users]);
  // console.log(userCreatePopUp);
  const [groupsShow, setGroupsShow] = useState();
  const [rightsShow, setRightsShow] = useState();
  const [selected, setSelected] = useState({});
  const [groupCreatePopUp, setGroupCreatePopUp] = useState();
  const [groupEditPopUo, setGroupEditPopUp] = useState();
  const [APIrights, setAPIrights] = useState();
  console.log(selected);
  console.log(groupsShow);
  console.log(groups);
  console.log(rights);
  return (
    <React.Fragment>
      {userCreatePopUp && <UserCreatePopUp />}
      {userEditPopUp && data && <UserEditPopUp data2={data} />}
      {!groupsShow && !rightsShow && (
        <DataGrid
          // focusedRowEnabled={true}
          onRowClick={onSelectionChanged}
          dataSource={users}
        >
          <Column dataField="login" caption="Логин" />
          <Column dataField="name" caption="Имя" />
          <Column dataField="email" caption="Почта" />
          <Column dataField="companyName" caption="Имя копмании" />
          <Selection mode="single" />
          <Toolbar>
            <Item location="before">
              <Button
                icon="plus"
                text="Создать"
                onClick={() => {
                  setUserCreatePopUp(true);
                  // setCreatePopUp(true);
                  // const inf = contacts.find((el) => el.id === contactId);
                  // setContactInfo({ ...inf, name: "", type: "", cАнontact: "" });
                }}
              />
            </Item>
            <Item location="before">
              <Button
                icon="rename"
                text="Изменить"
                onClick={() => {
                  setUserEditPopUp(true);
                  // setContactPopUp(true);
                  // const inf = contacts.find((el) => el.id === contactId);
                  // console.log(inf);
                  // setContactInfo(inf);
                }}
              />
            </Item>
            <Item location="before">
              <Button
                icon="rename"
                text="Группы"
                onClick={() => {
                  setGroupsShow(true);
                }}
              />
            </Item>
            <Item location="before">
              <Button
                text="Права"
                onClick={() => {
                  setRightsShow(true);
                }}
              />
            </Item>
          </Toolbar>
        </DataGrid>
      )}
      {groupsShow && (
        <>
          <DataGrid
            dataSource={groups}
            onSelectionChanged={(e) => {
              setSelected(e.currentSelectedRowKeys[0]);
              console.log(e);
            }}
          >
            <Column dataField="name" caption="Название" />
            <Selection mode="single" />
            <Toolbar>
              <Item location="before">
                <Button
                  // icon="plus"
                  text="Вернуться"
                  onClick={() => {
                    setGroupsShow(false);
                    // setCreatePopUp(true);
                    // const inf = contacts.find((el) => el.id === contactId);
                    // setContactInfo({ ...inf, name: "", type: "", contact: "" });
                  }}
                />
              </Item>
              <Item location="before">
                <Button
                  icon="plus"
                  text="Создать"
                  onClick={() => {
                    setSelected({});
                    setGroupCreatePopUp(true);
                    // setCreatePopUp(true);
                    // const inf = contacts.find((el) => el.id === contactId);
                    // setContactInfo({ ...inf, name: "", type: "", contact: "" });
                  }}
                />
              </Item>
              <Item location="before">
                <Button
                  icon="rename"
                  text="Изменить"
                  onClick={async () => {
                    setGroupEditPopUp(true);
                    const rights = await getRightsByGroupid(selected.id);
                    console.log(rights);
                    setAPIrights(rights);
                    setSelected({
                      ...selected,
                      rights: rights.map((right) => right.id),
                    });
                    // setContactPopUp(true);
                    // const inf = contacts.find((el) => el.id === contactId);
                    // console.log(inf);
                    // setContactInfo(inf);
                  }}
                />
              </Item>
              <Item location="before">
                <Button
                  icon="rename"
                  text="Удалить"
                  onClick={async () => {
                    if (
                      window.confirm("Вы уверены, что хотите удалить группу?")
                    ) {
                      await deleteGroups(selected.id);
                      setGroups(await getGroups());
                    }
                  }}
                />
              </Item>
            </Toolbar>
          </DataGrid>

          <Popup
            onHiding={() => {
              setGroupEditPopUp(false);
              // console.log(selected);
              // console.log(selectedStaffPoints);
              // console.log(pointsData);
            }}
            visible={groupEditPopUo}
            title={`Группа`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="600px"
          >
            Название:
            <TextBox
              onValueChanged={(e) =>
                setSelected({ ...selected, name: e.value })
              }
              value={selected?.name}
            />
            Права:
            <TagBox
              items={rights}
              // value={group?.id}
              valueExpr={"id"}
              displayExpr={"name"}
              onValueChanged={(e) => {
                console.log(e.value);
                console.log(rights);
                setSelected({ ...selected, rights: e.value });
              }}
              value={selected?.rights}
            />
            <Button
              text="Сохранить"
              onClick={async () => {
                let toAddRights = [];
                let toDeleteRights = [];
                selected.rights.forEach((right) => {
                  if (!APIrights.find((el) => el.id === right)) {
                    toAddRights.push(right);
                  }
                });
                APIrights.forEach((el) => {
                  if (!selected.rights.find((right) => el.id === right)) {
                    toDeleteRights.push(el.id);
                  }
                });

                console.log(selected, APIrights);
                console.log(toDeleteRights, toAddRights);
                deleteRights(
                  toDeleteRights.map((el) => ({
                    RightId: el,
                    GroupId: selected.id,
                  }))
                );
                addRights(
                  toAddRights.map((el) => ({
                    RightId: el,
                    GroupId: selected.id,
                  }))
                );
                setGroupEditPopUp(false);
                await editGroups(selected);
                setGroups(await getGroups());
              }}
            />
          </Popup>

          <Popup
            onHiding={() => {
              setGroupCreatePopUp(false);
              // console.log(selected);
              // console.log(selectedStaffPoints);
              // console.log(pointsData);
            }}
            visible={groupCreatePopUp}
            title={`Группа`}
            showCloseButton={true}
            position="center"
            width="500px"
            height="500px"
          >
            Название:
            <TextBox
              onValueChanged={(e) =>
                setSelected({ ...selected, name: e.value })
              }
              value={selected?.name}
            />
            Права:
            <TagBox
              items={rights}
              // value={group?.id}
              valueExpr={"id"}
              displayExpr={"name"}
              onValueChanged={(e) => {
                console.log(e.value);
                console.log(rights);
                setSelected({ ...selected, rights: e.value });
              }}
              value={selected?.rights}
            />
            <Button
              text="Сохранить"
              onClick={async () => {
                if (selected.name) {
                  const res = await addGroups({ name: selected.name });
                  delete selected["name"];
                  console.log(selected);
                  console.log(selected.id);
                  await addRights(
                    selected.rights.map((el) => ({
                      RightId: el,
                      GroupId: res.result,
                    }))
                  );
                  console.log(res);
                  setGroupCreatePopUp(false);
                } else alert("Введите название");
                setGroups(await getGroups());
              }}
            />
          </Popup>
        </>
      )}
      {rightsShow && (
        <>
          <DataGrid dataSource={rights}>
            <Toolbar>
              <Item location="before">
                <Button
                  // icon="plus"
                  text="Вернуться"
                  onClick={() => {
                    setRightsShow(false);
                    // setCreatePopUp(true);
                    // const inf = contacts.find((el) => el.id === contactId);
                    // setContactInfo({ ...inf, name: "", type: "", contact: "" });
                  }}
                />
              </Item>
            </Toolbar>
            <Column dataField="name" caption="Название" />
            <Column dataField="code" caption="Код" />
            <Column dataField="groupId" caption="Группа" />
          </DataGrid>
        </>
      )}
    </React.Fragment>
  );
}

const dataSource = {
  store: {
    version: 2,
    type: "odata",
    key: "Task_ID",
    url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks",
  },
  expand: "ResponsibleEmployee",
  select: [
    "Task_ID",
    "Task_Subject",
    "Task_Start_Date",
    "Task_Due_Date",
    "Task_Status",
    "Task_Priority",
    "Task_Completion",
    "ResponsibleEmployee/Employee_Full_Name",
  ],
};

const priorities = [
  { name: "High", value: 4 },
  { name: "Urgent", value: 3 },
  { name: "Normal", value: 2 },
  { name: "Low", value: 1 },
];
