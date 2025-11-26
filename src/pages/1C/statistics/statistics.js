import { useEffect, useState } from "react";
import { getStatistics } from "../../../restApi/Api1c";
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
import { GetStocks } from "../../../restApi";
import { Button } from "devextreme-react";
export default function Statistics() {
  const [chartData, setChartdata] = useState();
  const [shops, setShops] = useState();
  const [shopid, setShopid] = useState("");

  const getChart = async () => {
    setChartdata(await getStatistics({ stock_uid: shopid }));
  };

  //   useEffect(() => {
  //     (async function () {
  //       setChartdata(await getStatistics());
  //     })();
  //   }, []);

  useEffect(() => {
    (async function () {
      const s = await GetStocks();
      setShops(s);
    })();
  }, []);

  const formatToChart = (data) => {
    const res = data.map((el) => ({
      ["y" + el.year]: el.sum,
      valueField: "y" + el.year,
      name: el.year,
      ...el,
    }));
    for (let i = 0; i < res.length; i++) {
      delete res[i].year;
    }
    return res;
  };
  const shopChange = (e) => {
    setShopid(e.value);
  };
  console.log(chartData && formatToChart(chartData));
  const getSeries = (data) => {
    let res = [];
    data.forEach((el) => {});
    const chart = formatToChart(chartData);
    for (let i = 0; i < chart.length; i++) {
      let has = false;
      for (let j = 0; j < i; j++) {
        if (chart[i].valueField === chart[j].valueField) {
          has = true;
          break;
        }
      }
      if (!has) {
        res.push({ valueField: chart[i].valueField, name: chart[i].name });
      }
    }
    console.log(res);
    return res.map((el) => (
      <Series valueField={el.valueField} name={el.name} />
    ));
    // formatToChart(chartData).forEach(element => {
    //     map()
    // });
  };
  return (
    <>
      <h2>Статистика</h2>
      <SelectBox
        placeholder="Выберете магазин"
        dataSource={shops}
        displayExpr="name"
        defaultValue={shopid}
        searchEnabled={true}
        searchMode={"contains"}
        width={"400px"}
        onValueChanged={shopChange}
        showClearButton={true}
        // inputAttr={templatedProductLabel}
        valueExpr="id"
        // defaultValue={partners[0].uid}
      />
      <Button text="OK" onClick={getChart} />

      {chartData && (
        <Chart
          //   palette="Harmony Light"
          title="Статистика"
          dataSource={formatToChart(chartData)}
        >
          <CommonSeriesSettings argumentField="month" type={"splinearea"} />

          {getSeries(formatToChart(chartData))}
          {/* <Series valueField="year" name="year"></Series>
          <Series valueField="month" name="month"></Series> */}
          <ArgumentAxis valueMarginsEnabled={false} />
          <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          <Margin bottom={10} />
          <Export enabled={true} />
        </Chart>
      )}
    </>
  );
}
