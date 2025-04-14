import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const paginationModel = { page: 0, pageSize: 5 };
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Product Name", width: 150 },
  { field: "price", headerName: "Price ($)", type: "number", width: 100 },
  { field: "stock", headerName: "Stock", type: "number", width: 90 },
  { field: "itemsSold", headerName: "Items Sold", type: "number", width: 100 },
  { field: "collection", headerName: "Collection", width: 130 },
  { field: "revenue", headerName: "Revenue ($)", type: "number", width: 120 },
  { field: "discount", headerName: "Discount (%)", type: "number", width: 110 },
  { field: "isVisible", headerName: "Visible", type: "boolean", width: 90 },
  { field: "rating", headerName: "Rating", type: "number", width: 90 },
];

export default function ProductsTable({ rows, setSelectedRowId }) {
  console.log(rows);
  
  return (
    <Paper
      sx={{
        height: 450,
        width: "100%",
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <DataGrid
        onRowSelectionModelChange={(newSelection) => {
          console.log(newSelection[0]);

          setSelectedRowId(newSelection[0]);
        }}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#d6d6d6",
            color: "#333",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#d6d6d6",
          },
        }}
      />
    </Paper>
  );
}
