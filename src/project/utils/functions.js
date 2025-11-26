function toTypeGrid(dataType) {
  // типы в grid -> 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
  switch (dataType) {
    case "quantity":
    case "money":
      return "number";
    case "array":
      return "object";
    default:
      return "string";
  }
}

// функция формирование колонок для devexpress Grid
// типы в grid -> 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
export function ModifiedColumns(pricelist, stocks) {
  var columns = [
    // { dataField: "id", visible: false },
    // { dataField: "linkId", visible: false },
    //{caption:'Кол-во',dataField: 'quant', dataType:"number"},
    //{caption:'Цена',dataField: 'price', dataType:"number"},
  ];
  // колонки профайла
  for (var i = 0; i < pricelist.profile.columns.length; i++) {
    const Item = {};
    Item["caption"] = pricelist.profile.columns[i].name;
    Item["dataField"] = pricelist.profile.columns[i].code;
    Item["dataType"] = toTypeGrid(pricelist.profile.columns[i].dataType);
    if (pricelist.profile.columns[i].code == "name") {
      Item["fixed"] = true;
    }
    columns.push(Item);
  }
  // console.log(ModifiedColumns(pricelist, stocks));
  // колонки статистики +  остатки номенкратуры на складе
  for (var i = 0; i < stocks.length; i++) {
    alert("1");
    console.log(">>> ");
    var items = {
      caption: stocks[i].name,
      align: "center",
      columns: [
        // колонки статистики +  остатки номенкратуры на складе
        {
          caption: "Дата-In",
          dataField: stocks[i].id + "_" + "date_last_in",
          dataType: "date",
        },
        {
          caption: "Цена-In",
          dataField: stocks[i].id + "_" + "price_last_in",
          dataType: "number",
          format: "#0.00",
        },
        {
          caption: "Дата-Sale",
          dataField: stocks[i].id + "_" + "date_last_sale",
          dataType: "date",
        },
        {
          caption: "Цена-Sale",
          dataField: stocks[i].id + "_" + "price_last_sale",
          dataType: "number",
          format: "#0.00",
        },
        // остатки номенкратуры на складе
        {
          caption: "Остаток",
          dataField: "quant_" + stocks[i].name,
          dataType: "number",
        },
      ],
    };

    console.log(">> ", items);
  }
  console.log(columns);
  //alert("a");
  return columns;
}

export function ModifiedPriceList(pricelist, stocks) {
  var products = [];
  console.log(pricelist);
  for (var i = 0; i < pricelist.productsList.products.length; i++) {
    var productItem = pricelist.productsList.products[i];
    // добавляем в элементы meta, которые описаны в profile
    var item = { id: productItem.id };
    for (var c = 0; c < pricelist.profile.columns.length; c++) {
      var key = pricelist.profile.columns[c].code;
      if (productItem.meta[key] != undefined) {
        item[key] = productItem.meta[key];
      }
    }
    //добавляем в элементы staticts
    for (var j = 0; j < productItem.prodStatistics.length; j++) {
      key = productItem.prodStatistics[j].stock_uid + "_";
      item[key + "date_last_in"] = productItem.prodStatistics[j].date_last_in;
      item[key + "price_last_in"] =
        productItem.prodStatistics[j].price_last_in / 100;
      item[key + "date_last_sale"] =
        productItem.prodStatistics[j].date_last_sale;
      item[key + "price_last_sale"] =
        productItem.prodStatistics[j].price_last_sale / 100;
    }
    //добавляем остатков в магазинах
    //const stocks = GetStocks();
    if (productItem.stockInfo != undefined) {
      for (var j = 0; j < stocks.length; j++) {
        key = stocks[j].name;
        item["quant_" + key] = productItem.stockInfo[key];
      }
    }

    products.push(item);
  }
  return products;
}
