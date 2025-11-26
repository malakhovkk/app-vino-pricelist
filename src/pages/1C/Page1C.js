import {
  DataGrid,
  // ...
  FilterRow,
  SearchPanel,
  GroupPanel,
} from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { get1C } from "../../restApi";
import {
  Selection,
  Scrolling,
  LoadPanel,
  Paging,
  Pager,
} from "devextreme-react/cjs/data-grid";
import useStore from "../../zustand";
import Button from "devextreme-react/button";
import { GanttHeaderFilterSearch } from "devextreme-react/cjs/gantt";

const FormatCurrency = "#0.00;(#0.00)";

export const Page1C = ({ vendorId }) => {
  let myres = [];
  const [data, setData] = useState();

  // if (data) {
  //   let res = [];
  //   res = data.map((el) => el.meta);
  //   for (let i = 0; i < res.length; i++) {
  //     let _res = {};
  //     for (let key in res[i]) {
  //       if (!(key.includes("_Key") || key.includes("ВидАлкогольной"))) {
  //         _res[key] = res[i][key];
  //       }
  //     }
  //     // console.log(_res);
  //     myres.push(_res);
  //   }
  //   console.log(myres);
  // }

  function GetColumns() {
    let val = myres[0];
    let columns = [
      { caption: "Код 1с", dataField: "Code" },
      { caption: "Артикул", dataField: "Артикул" },
      { caption: "Наименование", dataField: "НаименованиеПолное" },
      { caption: "Крепость", dataField: "Крепость" },
    ];
    // for (let key in val) {
    //   if (
    //     !(
    //       key.includes("_Key") ||
    //       key.includes("ВидАлкогольной") ||
    //       key === "ГруппаСписка" ||
    //       key === "ВидНоменклатуры"
    //     )
    //   ) {
    //     let col = { dataField: key, caption: key };
    //     columns.push(col);
    //   }
    // }
    columns.push({
      caption: "ВидАлкогольнойПродукции",
      columns: [
        {
          caption: "Код",
          dataField: "ВидАлкогольнойПродукции.Code",
          dataType: "string",
        },
        {
          caption: "Описание",
          dataField: "ВидАлкогольнойПродукции.Description",
          dataType: "string",
        },
      ],
    });
    columns.push({
      caption: "Группа 1C",
      alignment: "center",
      columns: [
        // {
        //   caption: "Ref_key",
        //   dataField: "ГруппаСписка.Ref_Key",
        //   dataType: "string",
        // },
        {
          caption: "Код",
          dataField: "ГруппаСписка.Code",
          dataType: "string",
        },
        {
          caption: "Описание",
          dataField: "ГруппаСписка.Description",
          dataType: "string",
        },
        // {
        //   caption: "Parent_Key",
        //   dataField: "ГруппаСписка.Parent_Key",
        //   dataType: "string",
        // },
      ],
    });
    columns.push({
      caption: "ВидНоменклатуры",
      alignment: "center",
      columns: [
        {
          caption: "Описание",
          dataField: "ВидНоменклатуры.Description",
          dataType: "string",
        },
        {
          caption: "ТипНоменклатуры",
          dataField: "ВидНоменклатуры.ТипНоменклатуры",
          dataType: "string",
        },
        {
          caption: "ОсобенностьУчета",
          dataField: "ВидНоменклатуры.ОсобенностьУчета",
          dataType: "string",
        },
        {
          caption: "Импорт",
          dataField: "ВидНоменклатуры.ИмпортнаяАлкогольнаяПродукция",
          dataType: "boolean",
        },
        {
          caption: "Алкоголь",
          dataField: "ВидНоменклатуры.АлкогольнаяПродукция",
          dataType: "boolean",
        },
      ],
    });
    columns.push({
      caption: "Цены",
      alignment: "center",
      columns: [
        {
          caption: "цены_Варшавка",
          dataField: "90eeaa61-bfbb-11eb-82c8-001d7dd64d88",
          dataType: "number",
          format: FormatCurrency,
        },
        {
          caption: "цены_Садовая",
          dataField: "ab261fe0-1bbe-11ee-8bf2-d09466028ae0",
          dataType: "number",
          format: FormatCurrency,
        },
        {
          caption: "цены_закупочные",
          dataField: "f210a7ed-d027-11eb-82c9-001d7dd64d88",
          dataType: "number",
          format: FormatCurrency,
        },
      ],
    });
    // for (let i = 1; i < 6; i++) {
    //   columns.push({
    //     caption: `Цены[${i}]`,
    //     columns: [
    //       {
    //         caption: "Код",
    //         dataField: `code[${i}]`,
    //         dataType: "string",
    //       },
    //       {
    //         caption: "Имя",
    //         dataField: `name[${i}]`,
    //         dataType: "string",
    //       },
    //       {
    //         caption: "Цена",
    //         dataField: `price[${i}]`,
    //         dataType: "string",
    //       },
    //       {
    //         caption: "reg_date",
    //         dataField: `reg_date[${i}]`,
    //         dataType: "string",
    //       },
    //     ],
    //   });
    // }

    // if (data) {
    //   let res = {};
    //   for (let i = 0; i < data.length; i++) {
    //     let mycolumns = [];
    //     for (let j = 0; j < data[i].productPrice.length; j++) {
    //       mycolumns.push({
    //         caption: data[i].productPrice[j].code,
    //         dataField: data[i].productPrice[j].uid,
    //       });
    //       res['caption'] = data[i].productPrice[j].code;

    //     }
    //     columns.push({ caption: "Цены", columns: mycolumns });
    //   }
    // }
    console.log("columns", columns);
    return columns;
  }

  const { is1C, setIs1C } = useStore();

  //console.log(GetColumns());
  //console.log(data);

  useEffect(() => {
    (async function () {
      setData(await get1C(vendorId));
    })();
  }, []);

  function GetTable() {
    let t = data.map((el) => el.meta);

    for (let i = 0; i < t.length; i++) {
      for (let key in t[i]) {
        if (typeof t[i][key] === "object") {
          //   console.log(t[i][key])
          for (let k in t[i][key]) {
            t[key + "." + k] = t[i][key][k];
            // console.warn(key + "." + k, " = ", t[i][key][k]);
          }
        }
      }
    }
    let p = [];
    for (let i = 0; i < t.length; i++) {
      let cur = {};
      for (let j = 0; j < data[i].productPrice.length; j++) {
        if (
          data[i].productPrice[j].uid ===
            "90eeaa61-bfbb-11eb-82c8-001d7dd64d88" ||
          data[i].productPrice[j].uid ===
            "ab261fe0-1bbe-11ee-8bf2-d09466028ae0" ||
          data[i].productPrice[j].uid === "f210a7ed-d027-11eb-82c9-001d7dd64d88"
        ) {
          cur[data[i].productPrice[j].uid] =
            data[i].productPrice[j].price / 100;
        }
      }
      // console.log({ ...t[i], ...cur });
      t[i] = { ...t[i], ...cur };
      t[i].uid = data[i].uid;
    }
    // let p = data.map((el) => el.productPrice);
    // for (let i = 0; i < p.length; i++) {
    //   for (let key in p[i]) {
    //     //   console.log(t[i][key])
    //     for (let k in p[i][key]) {
    //       p[`${key}[${i + 1}]`] = p[i][key][k];
    //       // console.warn(key + "." + k, " = ", t[i][key][k]);
    //     }
    //   }
    // }
    // for(let i = 0; i < t.length; i++)
    // {
    //   for(let j = 0; j < p[i].length; j++)
    //   {

    //   }
    // }
    // console.log(p);

    // for (let i = 0; i < p.length; i++) {
    //   for (let j = 0; j < data[i].productPrice.length; j++) {
    //     for (let key in data[i].productPrice[j]) {
    //       data[i][`${key}[${j + 1}]`] = data[i].productPrice[j][key];
    //       console.log(`${key}[${j + 1}]`, "=", data[i].productPrice[j][key]);
    //     }
    //   }
    // }
    // for (let key in t[i]) {
    //   t[``];
    //   if (typeof t[i][key] === "object") {
    //     //   console.log(t[i][key])
    //     for (let k in t[i][key]) {
    //       t[key + "." + k] = t[i][key][k];
    //       // console.warn(key + "." + k, " = ", t[i][key][k]);
    //     }
    //   }
    //}
    // for (let i = 1; i < t.length + 1; i++) {
    //   for (let j = 0; j < t[i - 1].productPrice.length; j++) {
    //     for (let key in t[i - 1].productPrice[j]) {
    //       t[`${key}[${j + 1}]`] = t[i - 1].productPrice[j][key];
    //       // console.log(
    //       //   `${key}[${j + 1}]`,
    //       //   "=",
    //       //   data[i - 1].productPrice[j][key]
    //       // );
    //     }
    //   }
    // }
    console.log("repair data", t);
    return t;
  }

  //console.log("datasource", data && GetTable());

  return (
    <>
      <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
        <Button
          icon="back"
          id="icon-disabled-back"
          onClick={() => {
            setIs1C(false);
          }}
        />{" "}
      </div>
      {data && (
        <DataGrid
          columnAutoWidth={true}
          defaultColumns={GetColumns()}
          dataSource={GetTable()}
          height="100%"
          showBorders={true}
          keyExpr="uid"
        >
          <Pager visible={true} />
          <Paging defaultPageSize={15} />
          <LoadPanel enabled={false} />
          <Scrolling mode="virtual" />
          <Selection mode="single" />
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <GroupPanel visible={true} />
        </DataGrid>
      )}
    </>
  );
};
