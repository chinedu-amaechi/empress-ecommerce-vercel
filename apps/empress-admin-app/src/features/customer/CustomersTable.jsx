import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const paginationModel = { page: 0, pageSize: 5 };
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "fullName", headerName: "Customer Name", width: 200 },
  { field: "email", headerName: "Email", width: 220 },
  { field: "phone", headerName: "Phone Number", width: 150 },
  { field: "city", headerName: "City", width: 130 },
  { field: "country", headerName: "Country", width: 130 },
  { field: "registrationDate", headerName: "Registered On", width: 180 },
];

export default function CustomersTable({ rows, setSelectedRowId }) {
  const formattedRows = rows.map((customer) => ({
    id: customer._id,
    fullName: `${customer.firstName} ${customer.lastName}`,
    email: customer.email,
    phone: customer.phone,
    city: customer.address.city,
    country: customer.address.country,
    registrationDate: new Date(customer.createdAt).toLocaleDateString(),
  }));

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
          setSelectedRowId(newSelection[0]);
        }}
        rows={formattedRows}
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
