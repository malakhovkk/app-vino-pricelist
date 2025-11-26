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
import { saveContactChanges } from "../../new_api";
import DataGridContacts from "../DataGridContacts";
import { Item } from "devextreme-react/data-grid";
import useStore from "../../zustand";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import SelectBox from "devextreme-react/select-box";

export default function CreatePopUp() {
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
    if (!contactInfo.type || !contactInfo.name || !contactInfo.name) return;
    await createContact({
      ...contactInfo,
      type: typeS[contactInfo["type"]],
      id: "",
    });
    const cs = await getContacts(vendorId);
    // if (cs.length === 0) return;
    console.log(cs);
    setContacts(cs);
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
  } = useStore();
  const [contact1, setContact1] = useState({ name: "", contact: "", type: "" });
  // useEffect(() => {
  //   // if (contactInfo["contact"]) {
  //   setContactInfo({ ...contactInfo, name: "", contact: "", type: "" });
  //   // }
  // }, [createPopUp]);
  return (
    <Popup
      onHiding={() => {
        setCreatePopUp(false);
      }}
      visible={createPopUp}
      title={`Создание контакта поставщика`}
      showCloseButton={true}
      position="center"
      width="500px"
      height="500px"
    >
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Контакт:</div>
          <div className="dx-field-value">
            <TextBox
              onValueChanged={(e) => {
                console.log(e);
                setContact1({ ...contact1, contact: e.value });
              }}
              // onChange={(e) => {
              //   console.log(e);
              //   setContactInfo({ ...contactInfo, contact: e.value });
              // }}
              value={contact1?.contact}
              // value={addInfo}
              // onValueChanged={(e) => setAddInfo(e.value)}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Имя:</div>
          <div className="dx-field-value">
            <TextBox
              value={contact1?.name}
              onValueChanged={(e) => {
                console.log(e);
                setContact1({ ...contact1, name: e.value });
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
              value={contact1?.type}
              onValueChanged={(e) => {
                console.log(e.value);
                setContact1({ ...contact1, type: e.value });
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
          </div>
        </div>
      </div>
      <Button text="Создать контакт" onClick={saveChanges} />
    </Popup>
  );
}
