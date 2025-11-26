import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  FilterRow,
  LoadPanel,
} from "devextreme-react/data-grid";
import { useCallback, useEffect, useState } from "react";
import { Selection } from "devextreme-react/data-grid";
import { Toolbar } from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import Button from "devextreme-react/button";
import useStore from "../zustand";

export default function DataGridContacts() {
  const [contactId, setContactId] = useState("");
  const [createPopUp, setCreatetPopUp] = useState();
  //   const [contactInfo, setContactInfo] = useState({});
  const {
    setContactPopUp,
    setCreatePopUp,
    setContactInfo,
    contactPopUp,
    contacts,
  } = useStore();
  useEffect(() => {
    if (contacts.length) setContactId(contacts[0].id);
  }, []);
  console.warn(contacts);
  //   const [contactPopUp, setContactPopUp] = useState(false);
  const onSelectionChangedContacts = function (e) {
    setContactId(e.selectedRowKeys[0]);
    console.log(e);
    console.log(contacts);
    console.log(contacts.find((el) => el.id === e.selectedRowKeys[0]));
    setContactInfo(contacts.find((el) => el.id === e.selectedRowKeys[0]));
  };
  return (
    <>
      <DataGrid
        dataSource={contacts}
        keyExpr="id"
        className="grid theme-dependent"
        focusedRowEnabled={true}
        defaultSelectedRowKeys={[]}
        noDataText="нет контактов"
        onSelectionChanged={onSelectionChangedContacts}
      >
        <Paging enabled={false} />
        <Column dataField="name" caption="Имя" />
        <Column dataField="contact" caption="Контакт" />
        <Column dataField="type" caption="Тип" />
        <LoadPanel enabled={true} />
        <Selection mode="single" />
        <Toolbar>
          <Item location="before">
            <Button
              icon="plus"
              text="Создать"
              onClick={() => {
                setCreatePopUp(true);
                const inf = contacts.find((el) => el.id === contactId);
                setContactInfo({ ...inf, name: "", type: "", contact: "" });
              }}
            />
          </Item>
          <Item location="before">
            <Button
              icon="rename"
              text="Изменить"
              onClick={() => {
                setContactPopUp(true);
                const inf = contacts.find((el) => el.id === contactId);
                console.log(inf);
                setContactInfo(inf);
              }}
            />
          </Item>
        </Toolbar>
      </DataGrid>
    </>
  );
}
