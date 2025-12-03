import { useEffect, useState } from "react";
import { getOrders } from "../../restApi";
import DataGrid, {
  Column,
  Sorting,
  Selection,
  Scrolling,
  Item,
  Toolbar,
  ToolbarItem,
} from "devextreme-react/data-grid";
import { MasterDetail } from "devextreme-react/cjs/data-grid";
import { GetOrdercontent } from "../../restApi";
import { Button, DateBox } from "devextreme-react";
// import { formatDate } from "devextreme/localization";
import { formatDate, formatNumber } from "devextreme/localization";
const FormatCurrency = "#0.00;(#0.00)";
function formatDate2(date) {
  //console.log("date.getDate.toDateString()", utils.removeTime(date));
  return formatDate(date, "yyyy-MM-dd");
}
const MasterDetailView = (e) => {
  console.log(e);
  const [data, setData] = useState([]);
  useEffect(() => {
    (async function () {
      setData(
        (await GetOrdercontent(e.data.data.id)).map((el) => ({
          id: el.id, // Это идентификатор продукта
          sku: el.product.sku,
          name: el.product.name,
          quant: el.quant,
          sum: el.sum,
          comment: el.comment,
        }))
      );
    })();
  }, []);

  // async function get_all() {
  //   return await GetOrdercontent(e.data.data.id);
  // }
  // res = get_all();
  //   console.log(res);
  return (
    <DataGrid keyExpr={"id"} dataSource={data}>
      <Column dataField="sku" />
      <Column dataField="name" />
      <Column dataField="quant" />
      <Column dataField="sum" format={FormatCurrency} />
      <Column dataField="comment" />
    </DataGrid>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [date1, setDate1] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [date2, setDate2] = useState(new Date());
  // useEffect(() => {
  //   (async function () {
  //     let orders;
  //     orders = await getOrders();
  //     console.log(orders);
  //     setOrders(orders);
  //   })();
  // }, []);
  const date1Change = (e) => {
    setDate1(e.value);
  };
  const date2Change = (e) => {
    setDate2(e.value);
  };
  const getData = async () => {
    let orders;
    orders = await getOrders(
      formatDate(date1, "yyyy-MM-dd"),
      formatDate(date2, "yyyy-MM-dd")
    );
    console.log(orders);
    setOrders(orders);
  };
  return (
    <div>
      <DataGrid dataSource={orders}>
        <MasterDetail
          enabled={true}
          autoExpandAll={false}
          component={MasterDetailView}
        />
        <Column caption="Номер" dataField="number" />
        <Column caption="Состав" dataField="content" />
        <Column caption="Комментарий" dataField="comment" />
        <Column caption="Дата создания" dataField="dateCreate" />
        <Column caption="Дата отправки" dataField="dateSend" />
        <Column caption="E-mail" dataField="eMailSend" />
        <Column caption="Правильный заказ" dataField="orderCorrect" />
        <Column caption="Ссылка на заказ" dataField="orderLink" />
        <Column caption="Позиции на заказ" dataField="orderPositions" />
        <Column caption="Название магазина" dataField="shopName" />
        <Column caption="Суммарная стоимость" dataField="totalPrice" />
        <Column caption="Название поставщика" dataField="vendorName" />
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
              // inputAttr={dateLabel}
              type="date"
              width={300}
              // displayFormat="shortdate"
              useMaskBehavior="true"
            />
          </Item>
          <Item location="before">
            <Button onClick={getData} text={"Получить"} />
          </Item>
        </Toolbar>
      </DataGrid>
    </div>
  );
}
