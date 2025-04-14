// apps/empress-admin-app/src/features/product/__tests__/ProductsTable.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import ProductsTable from "../ProductsTable";

// Mock MUI DataGrid
jest.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows, columns, onRowSelectionModelChange }) => {
    return (
      <div data-testid="data-grid">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.field}>{col.headerName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                data-testid={`row-${row.id}`}
                onClick={() => onRowSelectionModelChange([row.id])}
              >
                {columns.map((col) => (
                  <td key={`${row.id}-${col.field}`}>{row[col.field]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
}));

// Mock MUI Paper
jest.mock("@mui/material/Paper", () => {
  return function MockPaper({ children, sx }) {
    return (
      <div data-testid="mui-paper" style={sx}>
        {children}
      </div>
    );
  };
});

describe("ProductsTable Component", () => {
  const mockRows = [
    {
      id: "1",
      name: "Product 1",
      price: 99.99,
      stock: 10,
      itemsSold: 5,
      collection: "Collection 1",
      revenue: 499.95,
      discount: 0,
      isVisible: true,
      rating: 4.5,
    },
    {
      id: "2",
      name: "Product 2",
      price: 149.99,
      stock: 5,
      itemsSold: 3,
      collection: "Collection 2",
      revenue: 449.97,
      discount: 10,
      isVisible: true,
      rating: 4.2,
    },
  ];

  const mockSetSelectedRowId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the DataGrid with product rows", () => {
    render(
      <ProductsTable rows={mockRows} setSelectedRowId={mockSetSelectedRowId} />,
    );

    // Check DataGrid component is rendered
    expect(screen.getByTestId("data-grid")).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Product Name")).toBeInTheDocument();
    expect(screen.getByText("Price ($)")).toBeInTheDocument();
    expect(screen.getByText("Stock")).toBeInTheDocument();
    expect(screen.getByText("Items Sold")).toBeInTheDocument();
    expect(screen.getByText("Collection")).toBeInTheDocument();
    expect(screen.getByText("Revenue ($)")).toBeInTheDocument();
    expect(screen.getByText("Discount (%)")).toBeInTheDocument();
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();

    // Check product data
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("99.99")).toBeInTheDocument();
    expect(screen.getByText("Collection 1")).toBeInTheDocument();

    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("149.99")).toBeInTheDocument();
    expect(screen.getByText("Collection 2")).toBeInTheDocument();
  });

  it("calls setSelectedRowId when a row is clicked", () => {
    render(
      <ProductsTable rows={mockRows} setSelectedRowId={mockSetSelectedRowId} />,
    );

    // Click the first row
    fireEvent.click(screen.getByTestId("row-1"));

    // Check that setSelectedRowId was called with the correct ID
    expect(mockSetSelectedRowId).toHaveBeenCalledWith("1");

    // Click the second row
    fireEvent.click(screen.getByTestId("row-2"));

    // Check that setSelectedRowId was called with the correct ID
    expect(mockSetSelectedRowId).toHaveBeenCalledWith("2");
  });

  it("handles empty rows gracefully", () => {
    render(<ProductsTable rows={[]} setSelectedRowId={mockSetSelectedRowId} />);

    // DataGrid should still render with no rows
    expect(screen.getByTestId("data-grid")).toBeInTheDocument();

    // Headers should be present
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Product Name")).toBeInTheDocument();

    // No row data should be visible
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();
  });

  it("logs rows to console", () => {
    // Mock console.log
    console.log = jest.fn();

    render(
      <ProductsTable rows={mockRows} setSelectedRowId={mockSetSelectedRowId} />,
    );

    // Check that console.log was called with the rows
    expect(console.log).toHaveBeenCalledWith(mockRows);
  });
});
