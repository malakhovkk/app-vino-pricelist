import React from "react";
import { DataGrid, Column } from "devextreme-react/data-grid";
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import { tasks } from "./data.js";
import axios from "axios";
import { useState, useEffect } from "react";
import "devextreme/dist/css/dx.light.css";

const completedValue = (rowData) => rowData.Status === "Completed";
const DetailTemplate = (props) => {
  console.log(props.data);
  const [rez1, setRezult] = useState();
  useEffect(() => {
    const func = async () => {
      let res = await axios.get(`http://194.87.239.231:55555/api/deal`, {
        headers: {
          User: "admin",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJleHAiOjE3MzM5MjI1NzUsImlzcyI6IldpbmVTZXJ2ZXIiLCJhdWQiOiJhZG1pbiJ9.yahUfrAH_DGJ6W259SNT1IazB6fv_Rb1iPSLXBhGVbE",
        },
      });
      res = res.data;
      console.log(res);
      setRezult(
        res.map((el) => ({
          company: el.company,
          status: el.status,
          dealId: el.DealId,
          shop: el.shop,
          dealDateCreate: el.dealDateCreate,
          days: 0,
          quant: el.totalQuant,
          price: el.totalPrice,
          dealId: el.dealId,
        }))
      );
    };
    func();
  }, []);
  const getTasks = (key) =>
    new DataSource({
      store: new ArrayStore({
        data: props.data,
        key: "dealId",
      }),
      filter: ["dealId", "=", key],
    });

  const { FirstName, LastName, dealId } = props.data.data;
  console.log(props.data.key);
  const dataSource = getTasks(props.data.key);
  console.log(dataSource);
  return (
    <React.Fragment>
      <DataGrid
        id="grid-container"
        dataSource={dataSource}
        keyExpr="ID"
        showBorders={true}
      >
        {/* <Column dataField="Prefix" width={70} caption="Title" />
      <Column dataField="FirstName" />
      <Column dataField="LastName" />
      <Column dataField="Position" width={170} />
      <Column dataField="State" width={125} />
      <Column dataField="BirthDate" dataType="date" /> */}
        <Column dataField="company" caption="Компания" />
      </DataGrid>
    </React.Fragment>
  );
};
export default DetailTemplate;
