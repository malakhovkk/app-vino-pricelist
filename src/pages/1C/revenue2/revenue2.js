import DataGrid, {
  Column,
  Sorting,
  Selection,
  Scrolling,
  Item,
  Toolbar,
  ToolbarItem,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import DateBox from "devextreme-react/date-box";
import { useEffect, useState } from "react";
import { getRevenue2 } from "../../../restApi/Api1c";
import { formatDate } from "devextreme/localization";
import SelectBox from "devextreme-react/select-box";
import { GetStocks } from "../../../restApi";
import { getGroups } from "../../../restApi/Api1c";
export default function Revenue2() {
  const [data, setData] = useState([]);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [shopid, setShopid] = useState();
  const [shops, setShops] = useState();
  const [uid, setUid] = useState();
  const [groupid, setGroupid] = useState();
  const [groups, setGroups] = useState();
  useEffect(() => {
    (async function () {
      setShops(await GetStocks());
    })();
  }, []);

  const shopChange = (e) => {
    console.log(e);
    setShopid(e.value);
  };

  const date1Change = (e) => {
    console.log("date1Change=", e.value);
    setDate1(e.value);
  };
  const date2Change = (e) => {
    console.log("date2Change=", e.value.toDateString());
    setDate2(e.value);
  };
  const getData = async () => {
    setData(
      await getRevenue2({
        date1: formatDate(date1, "yyyy-MM-dd"),
        date2: formatDate(date2, "yyyy-MM-dd"),
        shopid,
        groupid,
      })
    );
  };
  const getFormattedData = (data) => {
    let codes = [];
    let res = [];
    for (let i = 0; i < data.length; i++) {
      if (codes.includes(data[i].code)) continue;
      codes.push(data[i].code);
      const code = data[i].code;
      const res_i = {
        group_name: data[i].group_name,
        origname: data[i].origname,
        code,
      };
      for (let j = 0; j < data.length; j++) {
        if (data[j].code === code) {
          res_i[data[j].to_char] = data[j].quant;
        }
      }
      res.push(res_i);
    }
    return res;
  };
  const fData = getFormattedData(data);
  const getColumns = (data) => {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      // console.log(
      //   Object.keys(data[i]).filter((el) => el !== "origname" && el !== "code")
      // );
      res.push(
        ...Object.keys(data[i]).filter(
          (el) => el !== "origname" && el !== "code" && el !== "group_name"
        )
      );
    }
    console.log(Array.from(new Set(res)));
    let arr = Array.from(new Set(res)).sort((a, b) => {
      console.log(+b.split("/")[1], +a.split("/")[1]);
      if (+b.split("/")[1] > +a.split("/")[1]) return -1;
      if (+b.split("/")[1] < +a.split("/")[1]) return +1;
      return +a.split("/")[0] - +b.split("/")[0];
    });
    console.log(arr);
    return arr;
  };
  console.log(data);
  console.log(fData);
  // useEffect(() => {
  //   setData(await getRevenue2(date1, date2));
  // }, [])
  useEffect(() => {
    (async function () {
      setGroups(await getGroups());
    })();
  }, []);

  const groupChange = (e) => {
    console.log(e);
    setGroupid(e.value);
  };
  console.log(groupid);
  return (
    <>
      <h2>Выручка по месяцам</h2>
      <DataGrid
        dataSource={fData}
        allowColumnResizing={true}
        allowColumnReordering={true}
        columnAutoWidth={true}
        showBorders={true}
      >
        <Column dataField="group_name" caption="Группа" />
        <Column dataField="origname" caption="Название" />
        <Column dataField="code" caption="Код" />
        {fData && getColumns(fData).map((col) => <Column dataField={col} />)}
        {/* <Column dataField="code" caption="Код" />
      <Column dataField="origname" caption="Название" />
      <Column dataField="to_char" caption="to_char" />
      <Column dataField="quant" caption="Количество" /> */}
        <Toolbar>
          <Item location="before">
            <DateBox
              onValueChanged={date1Change}
              defaultValue={date1}
              displayFormat="dd/MM/yyyy"
              // inputAttr={dateLabel}
              type="date"
              width={300}
              // displayFormat="shortdate"
              useMaskBehavior="true"
            />
          </Item>
          <Item location="before">
            <DateBox
              onValueChanged={date2Change}
              defaultValue={date2}
              displayFormat="dd/MM/yyyy"
              width={300}
              // inputAttr={dateLabel}
              type="date"
              // displayFormat="shortdate"
              useMaskBehavior="true"
            />
          </Item>
          <Item location="before">
            <SelectBox
              placeholder="Выберите магазин"
              dataSource={shops}
              displayExpr="name"
              defaultValue={shopid}
              searchEnabled={true}
              searchMode={"contains"}
              width={"300px"}
              onValueChanged={shopChange}
              showClearButton={true}
              // inputAttr={templatedProductLabel}
              valueExpr="id"
              // defaultValue={partners[0].uid}
            />
          </Item>
          <Item location="before">
            <SelectBox
              placeholder="Выберите..."
              dataSource={groups}
              displayExpr="origname"
              // defaultValue={groupid}
              searchEnabled={true}
              searchMode={"contains"}
              width={"300px"}
              onValueChanged={groupChange}
              showClearButton={true}
              // inputAttr={templatedProductLabel}
              valueExpr="uid"
              // defaultValue={partners[0].uid}
            />
          </Item>
          <Item location="before">
            <Button text="ОК" onClick={getData} />
          </Item>
        </Toolbar>
      </DataGrid>
    </>
  );
}
