import { useEffect, useState } from "react";
import { getCardsView, getCardsViewGroup } from "../../restApi";
import DataGrid from "devextreme-react/data-grid";
import { CardView as CardView2 } from "devextreme-react/card-view";
import {
  CardCover,
  Column,
  Selection,
  Paging,
  HeaderFilter,
  SearchPanel,
} from "devextreme-react/card-view";
import List from "devextreme-react/list";
import "devextreme/dist/css/dx.light.css";

function imageExpr({ First_Name, Last_Name }) {
  return `images/employees/new/${First_Name} ${Last_Name}.jpg`;
}

export default function CardView() {
  const [fetchedData, setFetchedData] = useState();
  const [groups, setGroups] = useState();
  useEffect(() => {
    (async () => {
      const data = await getCardsView();
      const groups = await getCardsViewGroup();
      setFetchedData(data);
      setGroups(groups);
    })();
  }, []);
  return (
    <>
      <DataGrid dataSource={fetchedData}></DataGrid>
      <DataGrid dataSource={groups}></DataGrid>
      <CardView2
        dataSource={fetchedData}
        keyExpr="ID"
        cardMinWidth={300}
        cardsPerRow="auto"
      >
        <Paging pageSize={4} />
        <HeaderFilter visible={true} />
        <SearchPanel visible={true} />
        <Selection mode="multiple" />
        <CardCover imageExpr={imageExpr} />

        <Column dataField="origname" caption="Название" allowSearch={false} />
        <Column
          dataField="group_name"
          allowFiltering={true}
          allowSorting={true}
          caption="группа"
        />
      </CardView2>
    </>
  );
}
