import { useEffect, useState, useCallback, useRef } from "react";
import CardView, {
  CardCover,
  Column,
  Selection,
  Paging,
  HeaderFilter,
  SearchPanel,
  CardViewRef,
} from "devextreme-react/card-view";
import { getCardsView, getCardsViewGroup } from "../../restApi";
import { Popup } from "devextreme-react/popup";
import DataGrid from "devextreme-react/data-grid";
// import CardView from "devextreme-react/card-view";

import List from "devextreme-react/list";
import "devextreme/dist/css/dx.light.css";

function imageExpr() {
  return `wine.png`;
}

export default function Card() {
  const [fetchedData, setFetchedData] = useState([]);
  const [filterGroup, setFilterGroup] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    (async () => {
      const data = await getCardsView();
      setFetchedData(Array.isArray(data) ? data : []);
    })();
  }, []);

  useEffect(() => {
    const root = wrapperRef.current;
    if (!root) return;
    const handler = (e) => {
      const link = e.target.closest?.(".group-link");
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      const group = link.dataset.group;
      setFilterGroup((prev) => (prev === group ? null : group));
    };
    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, []);

  const filteredData = filterGroup
    ? fetchedData.filter((it) => it.group_name === filterGroup)
    : fetchedData;

  return (
    <div ref={wrapperRef}>
      <div style={{ marginBottom: 12 }}>
        <strong>Фильтр по группе:</strong>{" "}
        {filterGroup ? (
          <>
            {filterGroup}{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFilterGroup(null);
              }}
            >
              (сбросить)
            </a>
          </>
        ) : (
          "все"
        )}
      </div>

      <CardView
        dataSource={filteredData}
        keyExpr="ID"
        cardMinWidth={300}
        cardsPerRow="auto"
        // НЕ используем cardComponent/cardContentRender, возвращаем строку HTML:
        cardTemplate={(cardData) => {
          const { origname, group_name } = cardData.card.data;
          return `
            <div class="card-content" style="padding:12px;">
            <img src='${imageExpr()}' style="width:200px"/>
              <div style="font-weight:600;margin-bottom:6px;">${
                origname ?? ""
              }</div>
              <a href="#" data-group="${group_name ?? ""}" class="group-link"
                 style="text-decoration:underline;cursor:pointer;">
                 ${group_name ?? "—"}
              </a>
            </div>
          `;
        }}
      >
        <Column
          dataField="origname"
          caption="Название"
          allowFiltering={false}
          allowHeaderFiltering={false}
        />

        {/* Только эта колонка участвует в фильтрах */}
        <Column
          dataField="group_name"
          caption="Группа"
          allowFiltering={true}
          allowHeaderFiltering={true}
        />
        <Paging pageSize={12} />
        <HeaderFilter visible />
        <SearchPanel visible />
        <CardCover imageExpr={() => "wine.png"} />
      </CardView>
    </div>
  );
}
