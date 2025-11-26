import { DataGrid } from "devextreme-react";
import Button from "devextreme-react/button";
import { useEffect, useState } from "react";
import {
  getCodes,
  getProfiles,
  addNewProfile,
  editProfile,
} from "../restApi/index";
import {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  FilterRow,
  LoadPanel,
  Lookup,
} from "devextreme-react/data-grid";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { Item } from "devextreme-react/data-grid";
import { Toolbar } from "devextreme-react/data-grid";
import TextBox, { TextBoxTypes } from "devextreme-react/text-box";
import SelectBox from "devextreme-react/select-box";
import { Selection } from "devextreme-react/data-grid";
import { Editing } from "devextreme-react/data-grid";

export default function ProfileMain({ vendorId, setAll }) {
  const [data, setData] = useState([]);
  const [isChangePopUp, setIsChangePopUp] = useState(false);
  const [isCreatePopUp, setIsCreatePopUp] = useState(false);
  const [cur, setCur] = useState({});
  const [codes, setCodes] = useState();

  useEffect(() => {
    (async function () {
      const _data = await getProfiles(vendorId);
      console.warn(":::", _data);
      setData(_data);
      setCodes(await getCodes());
    })();
  }, []);
  console.warn(">> ", codes);
  const change = () => {
    setIsChangePopUp(true);
    // const col = data.find(el => el.id === cur).columns;
  };
  const create = () => {
    setIsCreatePopUp(true);
  };
  console.log(data);
  const edit = (e) => {
    console.log(e);
  };
  const searchExpression = ["field"];
  const getDisplayExpr = (item) => (item ? `${item.field} ${item.name}` : "");
  const Field = ({ field, name }) => {
    return (
      <div className="custom-field">
        <div>{`${field} ${name}`}</div>
      </div>
    );
  };
  const [val, setVal] = useState({});
  const [mydata, setMydata] = useState([]);
  const saveAll = (e) => {
    mydata.push(e.changes[0].data);
    console.log(e.changes[0]);
    setMydata(mydata);
  };
  console.warn(mydata);
  const sendAdded = () => {
    console.warn(
      mydata
        .filter((d) => d.code)
        .map((el) => ({
          code: el.code,
          function: el.function,
          name: el.name,
          node: el.node,
          position: el.position,
        }))
    );
    addNewProfile({
      id: "",
      name: val.name,
      vendorId,
      columns: mydata
        .filter((d) => d.code)
        .map((el) => ({
          code: el.code,
          function: el.function,
          name: el.name,
          node: el.node,
          position: el.position,
          type: el.type,
        })),
    });
  };
  //   console.log(data.find((el) => el.id === cur.id).columns);
  const sendChanged = (e) => {
    const mine = data.find((el) => el.id === cur.id).columns;
    // console.warn(
    //   mydata
    //     .filter((d) => d.code)
    //     .map((el) => ({
    //       code: el.code,
    //       function: el.function,
    //       name: el.name,
    //       node: el.node,
    //       position: el.position,
    //     }))
    // );
    editProfile({
      id: cur.id,
      name: data.find((el) => el.id === cur.id).name,
      vendorId,
      columns: mine
        .filter((d) => d.code)
        .map((el) => ({
          code: el.code,
          function: el.function,
          name: el.name,
          node: el.node,
          position: el.position,
          dataType: el.dataType,
        })),
    });
  };
  return (
    <>
      {isChangePopUp && (
        <Popup
          title={`Изменение профайла`}
          showCloseButton={true}
          onHiding={() => setIsChangePopUp(false)}
          visible={true}
        >
          <div className="dx-field">
            <div className="dx-field-label">Название профайла:</div>
            <div className="dx-field-value">
              <TextBox
                // items={["телефон", "почта"]}
                // value={contact1?.type}
                value={cur.name}
                onValueChanged={(e) => {
                  console.log(e.value);
                  setCur({ ...cur, name: e.value });
                  // setContact1({ ...contact1, type: e.value });
                }}
                //   inputAttr={simpleProductLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Маска загружаемого файла:</div>
            <div className="dx-field-value">
              <TextBox
                // items={["телефон", "почта"]}
                // value={contact1?.type}
                onValueChanged={(e) => {
                  console.log(e.value);
                  // setContact1({ ...contact1, type: e.value });
                }}
                //   inputAttr={simpleProductLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Организация:</div>
            <div className="dx-field-value">
              <TextBox
                // items={["телефон", "почта"]}
                value={cur?.id}
                onValueChanged={(e) => {
                  setCur({ ...cur, id: e.value });
                  // setContact1({ ...contact1, type: e.value });
                }}
                //   inputAttr={simpleProductLabel}
              />
            </div>
          </div>
          <DataGrid
            dataSource={data && data.find((el) => el.id === cur.id).columns}
            onSaved={edit}
          >
            <Editing
              mode="row"
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
            />
            <Column dataField="position" caption="Позиция" />
            <Column dataField="code" caption="Код">
              <Lookup
                // dataSource={codes.map((code) => code.field)}
                // defaultValue={codes[0].code}
                // searchExpression={searchExpression}
                dataSource={codes.map((code) => code.field)}
                // valueExpr="code"
                // displayExpr={getDisplayExpr}
                // fieldRender={Field}
                // displayExpr="Name"
                // valueExpr="ID"
              />
            </Column>
            <Column dataField="node" caption="Key позиция json" />
            <Column dataField="name" caption="Название" />

            <Column dataField="function" caption="Функция">
              <Lookup
                dataSource={[
                  "Substring(3,7)",
                  "Substring(3, 0)",
                  "Split('\n', 1)",
                  "List(',')",
                  "Next(1)",
                  "Link('href','card')",
                ]}
              />
            </Column>
            <Column dataField="dataType" caption="Тип">
              <Lookup
                dataSource={[
                  "string",
                  "money",
                  "quantity",
                  "date",
                  "number",
                  "array",
                  "href",
                  "image",
                ]}
              />
            </Column>
          </DataGrid>
          <Button text="Сохранить" onClick={sendChanged} />
        </Popup>
      )}
      {isCreatePopUp && (
        <Popup
          title={`Создание профайла`}
          showCloseButton={true}
          onHiding={() => setIsChangePopUp(false)}
          visible={true}
        >
          <div className="dx-field">
            <div className="dx-field-label">Название профайла:</div>
            <div className="dx-field-value">
              <TextBox
                // items={["телефон", "почта"]}
                // value={contact1?.type}
                value={val.name}
                onValueChanged={(e) => {
                  console.log(e.value);
                  setVal({ ...val, name: e.value });
                  // setContact1({ ...contact1, type: e.value });
                }}
                //   inputAttr={simpleProductLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Маска загружаемого файла:</div>
            <div className="dx-field-value">
              <TextBox
                // items={["телефон", "почта"]}
                // value={contact1?.type}
                onValueChanged={(e) => {
                  console.log(e.value);
                  // setContact1({ ...contact1, type: e.value });
                }}
                //   inputAttr={simpleProductLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Организация:</div>
            <div className="dx-field-value">
              <TextBox
                // items={["телефон", "почта"]}
                value={val?.id}
                onValueChanged={(e) => {
                  setVal({ ...val, id: e.value });
                  // setContact1({ ...contact1, type: e.value });
                }}
                //   inputAttr={simpleProductLabel}
              />
            </div>
          </div>
          <DataGrid dataSource={mydata} onSaved={saveAll}>
            <Editing
              mode="row"
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
            />
            <Column dataField="position" caption="Позиция" />
            <Column dataField="code" caption="Код">
              <Lookup
                // dataSource={codes.map((code) => code.field)}
                // defaultValue={codes[0].code}
                // searchExpression={searchExpression}
                dataSource={codes.map((code) => code.field)}
                // valueExpr="code"
                // displayExpr={getDisplayExpr}
                // fieldRender={Field}
                // displayExpr="Name"
                // valueExpr="ID"
              />
            </Column>
            <Column dataField="node" caption="Key позиция json" />
            <Column dataField="name" caption="Название" />

            <Column dataField="function" caption="Функция">
              <Lookup
                dataSource={[
                  "Substring(3,7)",
                  "Substring(3, 0)",
                  "Split('\n', 1)",
                  "List(',')",
                  "Next(1)",
                  "Link('href','card')",
                ]}
              />
            </Column>
            <Column dataField="dataType" caption="Тип">
              <Lookup
                dataSource={[
                  "string",
                  "money",
                  "quantity",
                  "date",
                  "number",
                  "array",
                  "href",
                  "image",
                ]}
              />
            </Column>
          </DataGrid>
          <Button text="Сохранить" onClick={sendAdded} />
        </Popup>
      )}
      <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
        <Button
          icon="back"
          id="icon-disabled-back"
          onClick={() => {
            // setisOrders(false);
            setAll();
          }}
        />{" "}
      </div>
      <DataGrid
        onSelectionChanged={(e) => {
          console.log(e);
          setCur(e.selectedRowKeys[0]);
        }}
        dataSource={data}
      >
        <Column dataField="name" />
        <Column dataField="vendorId" />
        <Selection mode="single" />
        <Toolbar>
          <Item location="before" name="searchPanel" locateInMenu="auto" />
          <Item location="before">
            <div className="toolbar-separator"></div>
          </Item>
          <Item location="before">
            <Button icon="plus" text="Создать" onClick={create} />
          </Item>
          <Item location="before">
            <Button icon="group" text="Изменить" onClick={change} />
          </Item>
        </Toolbar>
      </DataGrid>
    </>
  );
}
