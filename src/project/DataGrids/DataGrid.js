function DataGrid() {
  return (
    <DataGrid
      key="id"
      dataSource={ModifiedPriceList(pricelist, stocks)} //() => ReloadPriceList()}
      columnAutoWidth={true}
      showBorders={true}
      focusedRowEnabled={true}
      keyExpr="id"
      // defaultColumns={columns} //() => GetcolumnsPL()}
      width="100%"
    >
      <Grouping contextMenuEnabled={true} />
      <GroupPanel visible={true} />
      <FilterRow visible={true} />
      <SearchPanel visible width={240} placeholder="Search" />
      {ModifiedColumns(pricelist, stocks).map(
        (col) =>
          !col.columns && (
            <Column
              caption={col.caption}
              dataField={col.dataField}
              // width={230}
              // fixed={true}
            />
          )
      )}
      {ModifiedColumns(pricelist, stocks).map(
        (col) =>
          col.columns && (
            <Column
              caption={col.caption}
              // width={230}
              // fixed={true}
            >
              {col.columns.map((el) => (
                <Column caption={el.caption} dataField={el.dataField} />
              ))}
            </Column>
          )
      )}
    </DataGrid>
  );
}
