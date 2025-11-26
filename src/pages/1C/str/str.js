import { useEffect, useState } from "react";
import { getStatistics, getStr } from "../../../restApi/Api1c";
import SelectBox from "devextreme-react/select-box";
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  ICommonSeriesSettingsProps,
  Margin,
  Export,
  Legend,
} from "devextreme-react/chart";
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Paging,
  SearchPanel,
  HeaderFilter,
  LoadPanel,
  Sorting,
  Selection,
  Scrolling,
  Item,
  Toolbar,
  ToolbarItem,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import DateBox from "devextreme-react/date-box";
import { formatDate } from "devextreme/localization";
import * as utils from "../utils";
import { GetStocks } from "../../../restApi";
import { useFetcher } from "react-router-dom";
import { getGroups } from "../../../restApi/Api1c";
export default function Str() {
  const [data, setData] = useState();
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [shopid, setShopid] = useState();
  const [shops, setShops] = useState();
  const [groupid, setGroupid] = useState();
  const [groups, setGroups] = useState();
  useEffect(() => {
    (async function () {
      setShops(await GetStocks());
    })();
  }, []);

  const shopChange = (e) => {
    setShopid(e.value);
  };
  function formatDate2(date) {
    const date2 = utils.removeTime(date);
    console.log(
      "formatDate=",
      date,
      "locale=",
      date2.toLocaleString(),
      "iso=",
      date2.toISOString(),
      "format=",
      formatDate(date, "yyyy-MM-dd")
    );
    return formatDate(date, "yyyy-MM-dd");
    // Это Максим нагородил!!!
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяц (0-11), добавляем 1 и форматируем
    const day = String(date.getDate()).padStart(2, "0"); // День (1-31)
    const year = date.getFullYear(); // Год (4 цифры)

    return `${day}/${month}/${year}`; // Форматируем строку
  }

  const getDatafunc = async () => {
    const data = await getStr({
      date1: formatDate2(date1),
      date2: formatDate2(date2.addDays(1)),
      shopid,
      groupid,
    });
    setData(data);
  };
  //   useEffect(() => {
  //     (async function () {
  //       setData(await getStr());
  //     })();
  //   }, []);
  const date1Change = (e) => {
    console.log("date1Change=", e.value);
    setDate1(e.value);
  };
  const date2Change = (e) => {
    console.log("date1Change=", e.value);
    setDate2(e.value);
  };
  const groupChange = (e) => {
    console.log(e);
    setGroupid(e.value);
  };
  useEffect(() => {
    (async function () {
      setGroups(await getGroups());
    })();
  }, []);
  return (
    <>
      <h2>Коэффициент сквозной продажи</h2>
      <DataGrid
        dataSource={data}
        keyExpr={"uid"}
        columnAutoWidth={true}
        allowColumnResizing={true}
        allowColumnReordering={true}
        width={"70%"}
        showRowLines={true}
        showColumnLines={true}
        showBorders={true}
      >
        <Sorting mode="single" />
        <Selection mode="single" />
        <LoadPanel enabled={true} />

        <Column dataField="plus" caption="Запас" dataType="number" />
        <Column dataField="minus" caption="Продажи" dataType="number" />
        <Column
          dataField="str"
          caption="STR,%"
          dataType="number"
          format={"#0.00"}
        />
        <Column dataField="group_name" caption="Группа" />
        <Column dataField="origname" caption="Категория" />
        <Column dataField="code" caption="Код" />
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
            <Button text="ОК" onClick={getDatafunc} />
          </Item>
        </Toolbar>
      </DataGrid>
    </>
  );
}
