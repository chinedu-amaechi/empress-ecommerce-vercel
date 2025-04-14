// apps/empress-admin-app/src/pages/__tests__/DashboardPage.test.js
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../DashboardPage";
import useProducts from "../../hooks/useProducts";
import useCollections from "../../hooks/useCollections";

// Mock the hooks
jest.mock("../../hooks/useProducts", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../hooks/useCollections", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the UI components
jest.mock("../../ui/OverviewCard", () => {
  return function MockOverviewCard({ children }) {
    return <div data-testid="overview-card">{children}</div>;
  };
});

jest.mock("../../ui/Heading", () => {
  return function MockHeading({ level, text }) {
    return <div data-testid={`heading-${level}`}>{text}</div>;
  };
});

jest.mock("../../ui/Spinner", () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

// Mock MUI charts
jest.mock("@mui/x-charts/BarChart", () => ({
  BarChart: () => <div data-testid="bar-chart">Bar Chart</div>,
}));

jest.mock("@mui/x-charts", () => ({
  PieChart: () => <div data-testid="pie-chart">Pie Chart</div>,
}));

describe("DashboardPage Component", () => {
  // Sample mock data
  const mockProducts = [
    { _id: "1", name: "Product 1", stock: 10, revenue: 500, itemsSold: 5 },
    { _id: "2", name: "Product 2", stock: 20, revenue: 1000, itemsSold: 10 },
  ];

  const mockCollections = [
    { _id: "1", name: "Collection 1", products: ["1", "2"] },
    { _id: "2", name: "Collection 2", products: ["3"] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading spinner when data is loading", () => {
    // Mock loading state
    useProducts.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    useCollections.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<DashboardPage />);

    // Should display spinner
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("displays error message when there is an error", () => {
    // Mock error state
    useProducts.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to load products"),
    });

    useCollections.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<DashboardPage />);

    // Should display error message
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });

  it("renders dashboard with data when loaded", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    render(<DashboardPage />);

    // Verify dashboard title is displayed
    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();

    // Verify overview cards are displayed
    const overviewCards = screen.getAllByTestId("overview-card");
    expect(overviewCards.length).toBeGreaterThan(0);

    // Verify charts are displayed
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();

    // Verify total sales calculation
    await waitFor(() => {
      expect(screen.getByText("$1500")).toBeInTheDocument();
    });

    // Verify total products calculation
    await waitFor(() => {
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });

  it("calculates dashboard metrics correctly", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    render(<DashboardPage />);

    // Verify calculations
    await waitFor(() => {
      // Total sales should be sum of revenue
      expect(screen.getByText("$1500")).toBeInTheDocument();

      // Total products should be sum of stock
      expect(screen.getByText("30")).toBeInTheDocument();

      // Orders should be displayed
      expect(screen.getByText("120")).toBeInTheDocument();
    });
  });
});
