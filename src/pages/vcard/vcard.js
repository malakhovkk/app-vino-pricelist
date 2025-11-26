import { useEffect, useState } from "react";
import { TextBox } from "devextreme-react";
import { Button } from "devextreme-react";
import { getVCards, sendVCard } from "../../restApi";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Editing,
  Column,
  Item,
  Toolbar,
  Selection,
} from "devextreme-react/data-grid";
import { saveUpdates } from "../../restApi";
import { removeVCard } from "../../restApi";
export default function VCard() {
  const [input, setInput] = useState();
  const fields = [
    "firstname",
    "lastname",
    "middlename",
    "firstname_en",
    "lastname_en",
    "middlename_en",
    "email",
    "cellphone",
    "position",
    "position_en",
    "organization",
  ];
  const [changed, setChanged] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    (async function () {
      setData(await getVCards());
    })();
  }, [changed]);
  // var FormData = require('form-data');
  const send = async () => {
    const formData = new FormData();
    const photoInput = document.getElementById("photo");
    formData.append("photo", photoInput.files[0]);
    console.log(formData);
    console.log(1);
    console.log(formData.get("photo"));
    for (let key in input) {
      console.log(key, input[key]);
      formData.append(key, input[key]);
    }
    console.log(formData);
    await sendVCard(formData);
    setChanged({ a: 1 });
    setShowPopUp(false);
  };

  const visitkaRender = (cellData) => {
    console.log(cellData.data.personid);
    return (
      <div>
        <Button
          text="Показать визитку"
          onClick={() =>
            (window.location.href = `http://localhost:8000/api/html/${cellData.data.personid}`)
          }
        />
      </div>
    );
  };

  const renderGridCell = (cellData) => (
    <div>
      {cellData.value !== "undefined" && (
        <img
          src={`http://localhost:8000/photo/${cellData.value}`}
          width={50}
          alt="Employee photo"
        ></img>
      )}
    </div>
  );

  const [editdata, setEditdata] = useState();
  const [showPopUp, setShowPopUp] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [cur, setCur] = useState({});
  const add = () => {
    setShowPopUp(true);
    let input_zero = {};
    fields.forEach((el) => (input_zero[el] = ""));
    setEditdata(input_zero);

    setInput(input_zero);
    setIsEdit(false);

    if (document.getElementById("photo"))
      document.getElementById("photo").value = "";
  };
  const edit = () => {
    if (!editdata) {
      alert("Выберите человека!");
      return;
    }
    let input_zero = {};
    fields.forEach((el) => {
      if (!input[el]) input_zero[el] = "";
      else input_zero[el] = input[el];
    });
    input_zero["personid"] = input["personid"];
    setEditdata(input_zero);

    setInput(input_zero);
    setIsEdit(true);
    setShowPopUp(true);
  };
  const remove = async () => {
    console.log(input.personid);
    await removeVCard(input.personid);
    setData(await getVCards());
  };
  const saveChanges = async () => {
    const formData = new FormData();
    const photoInput = document.getElementById("photo");
    if (photoInput.files[0]) formData.append("photo", photoInput.files[0]);

    console.log(formData);
    console.log(1);
    console.log(formData.get("photo"));
    delete input["photo"];
    for (let key in input) {
      console.log(key, input[key]);
      formData.append(key, input[key]);
    }

    await saveUpdates(formData);
    setData(await getVCards());
    setEditdata();
    setShowPopUp(false);
  };
  console.log(fields, editdata);
  console.log(showPopUp);
  console.log("EditData: ", editdata);
  console.log("Input: ", input);
  const [personId, setPersonId] = useState();
  const handleSelectionChanged = (e) => {
    setInput(e.selectedRowsData[0]);
    setEditdata(e.selectedRowsData[0]);
    setPersonId(e.selectedRowsData[0].personid);
    console.log(e);
    console.log(e.selectedRowsData[0]);
  };
  return (
    <>
      <Popup
        onHiding={() => {
          setShowPopUp(false);
        }}
        visible={showPopUp}
        title={`VCard`}
        showCloseButton={true}
        position="center"
        width="500px"
        height="500px"
      >
        <div style={{ marginLeft: "30px" }}>
          {editdata &&
            fields.map((field) => (
              <div>
                <b>{field}</b>:{" "}
                <TextBox
                  width={300}
                  showClearButton={true}
                  placeholder="Введите запрос..."
                  valueChangeEvent="keyup"
                  value={editdata[field]}
                  onValueChange={(e) => {
                    console.log(">>>", e);
                    setInput({ ...input, [field]: e });
                  }}
                />
              </div>
            ))}

          <input
            type="file"
            id="photo"
            name="photo"
            // value={editdata["photo"]}
            accept="image/*"
            required
          ></input>
          {!isEdit ? (
            <Button
              text="Сохранить"
              style={{ marginTop: "30px" }}
              onClick={send}
              useSubmitBehavior={true}
            />
          ) : (
            <Button
              text="Сохранить"
              style={{ marginTop: "30px" }}
              onClick={saveChanges}
              useSubmitBehavior={true}
            />
          )}
        </div>
      </Popup>
      <DataGrid
        onRowClick={(e) => console.log(e)}
        onSelectionChanged={handleSelectionChanged}
        // onSaved={(e) => {
        //   // saveUpdates(input, )
        //   const formData = new FormData();
        //   const photoInput = document.getElementById("photo");
        //   formData.append("photo", photoInput.files[0]);
        //   console.log(formData);
        //   console.log(1);
        //   console.log(formData.get("photo"));
        //   for (let key in input) {
        //     console.log(key, input[key]);
        //     formData.append(key, input[key]);
        //   }
        //   saveUpdates(formData);
        // }}
        dataSource={data?.rows}
        // onEditingStart={(e) => setEditdata(e.data)}
      >
        {/* <Editing
          allowUpdating={true}
          // allowAdding={true}
          // allowDeleting={true}
          mode="row"
        /> */}
        <Selection mode="single" />
        <Column dataField="personid" visible={true} allowEditing={false} />
        <Column dataField="firstname" />
        <Column dataField="lastname" />
        <Column dataField="middlename" />

        <Column dataField="firstname_en" />
        <Column dataField="lastname_en" />
        <Column dataField="middlename_en" />
        <Column dataField="email" />
        <Column dataField="cellphone" />
        <Column dataField="position" />
        <Column dataField="position_en" />
        <Column dataField="organization" />
        <Column
          dataField="photo"
          width={90}
          // allowEditing={false}
          cellRender={renderGridCell}
        />
        {/* <Column daafield="visitka" width={200} cellRender={visitkaRender} /> */}
        <Toolbar>
          <Item location="before">
            <Button icon="plus" onClick={add} />
          </Item>
          <Item location="before">
            <Button text="Редактировать" onClick={edit} />
          </Item>
          <Item location="before">
            <Button text="Удалить" onClick={remove} />
          </Item>
          <Item location="before">
            <Button
              text="Показать визитку RU"
              onClick={() => {
                if (personId)
                  window.location.href = `http://localhost:8000/api/html/ru/${personId}`;
              }}
            />
          </Item>
          <Item location="before">
            <Button
              text="Показать визитку EN"
              onClick={() => {
                if (personId)
                  window.location.href = `http://localhost:8000/api/html/en/${personId}`;
              }}
            />
          </Item>
        </Toolbar>
      </DataGrid>
    </>
  );
}
