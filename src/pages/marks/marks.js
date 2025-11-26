import { Button, TextBox } from "devextreme-react";
import DataGrid, {
  Column,
  Sorting,
  Selection,
  Scrolling,
  Item,
  Toolbar,
  ToolbarItem,
} from "devextreme-react/data-grid";
import { useState } from "react";
import { markFind } from "../../restApi";
export default function Marks() {
  const [code, setCode] = useState();
  const [data, setData] = useState();
  const send = async () => {
    setData(await markFind(code));
  };
  const types = {
    0: "ПриобретениеТоваровУслуг",
    1: "ВозвратТоваровПоставщику",
    2: "РеализацияТоваровУслуг",
    3: "ОтчетОРозничныхПродажах",
    4: "ОтчетОРозничныхВозвратах",
    5: "Пересортица",
    6: "Излишки",
    7: "ПеремещениеТоваров",
  };
  return (
    <>
      <DataGrid
        dataSource={data?.map((el) => ({
          ...el,
          itype: types[el.itype],
        }))}
      >
        <Toolbar>
          <Item location="before">
            {/* Code: */}
            <TextBox
              placeholder="Код"
              onValueChanged={(e) => setCode(e.value)}
              value={code}
            />
          </Item>
          <Item location="before">
            <Button
              text="OK"
              onClick={() => {
                send();
              }}
            />
          </Item>
        </Toolbar>
        <Column dataField="code" caption="Код" />
        <Column
          dataField="date"
          dataType="date"
          format={"dd/MM/yyyy"}
          caption="Дата"
        />
        <Column dataField="info" caption="Инфо" />
        <Column dataField="itype" caption="Итип" />
        <Column dataField="line" caption="Линия" />
        <Column dataField="meta" caption="Мета" />
        <Column dataField="num" caption="Номер" />
        <Column dataField="origname" caption="Название" />
        <Column dataField="product_code" caption="Продукт_код" />
        <Column dataField="stock_name" caption="Склад" />
        <Column dataField="quant" caption="Количество" />
        <Column dataField="quant_use" caption="Используемое количество" />
        <Column dataField="sign" caption="Знак" />
        <Column dataField="stype" caption="Стайп" />
      </DataGrid>
    </>
  );
}
