// src/components/ui/__test__/navbar.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "../navbar";
import { CartContextProvider } from "../../../app/contexts/cart-context";
import * as useCollections from "../../../hooks/use-collections";

// Mock the necessary dependencies
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the useCollections hook
jest.mock("../../../hooks/use-collections", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    return <img src={props.src} alt={props.alt} className={props.className} />;
  },
}));

describe("Navbar Component", () => {
  // Set up mock data before each test
  beforeEach(() => {
    // Mock the collections data that the hook would return
    useCollections.default.mockReturnValue({
      data: [
        { _id: "collection1", name: "Ethereal" },
        { _id: "collection2", name: "Divine" },
        { _id: "collection3", name: "Heritage" },
      ],
      isLoading: false,
      error: null,
    });

    // Reset any window properties we modify
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock window.matchMedia to handle media queries
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Navbar renders with all expected elements
  it("renders the navbar with logo, navigation links, and action buttons", () => {
    // ARRANGE: Render the navbar with all required context
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // ACT: Find key navbar elements
    const logo = screen.getByAltText("Empress Logo");
    const collectionsLink = screen.getByText(/collections/i);
    const shopLink = screen.getByText(/shop/i);
    const aboutLink = screen.getByText(/about/i);
    const faqLink = screen.getByText(/faq/i);
    const cartButton = screen.getByLabelText(/shopping cart/i);

    // ASSERT: Verify all elements are present
    expect(logo).toBeInTheDocument();
    expect(collectionsLink).toBeInTheDocument();
    expect(shopLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(faqLink).toBeInTheDocument();
    expect(cartButton).toBeInTheDocument();
  });

  // Test 2: Mobile menu toggle
  it("toggles the mobile menu when the menu button is clicked", async () => {
    // ARRANGE: Set up userEvent and render navbar
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // ACT: Find and click the mobile menu button
    const menuButton = screen.getByLabelText(/open menu/i);
    await user.click(menuButton);

    // ASSERT: Verify mobile menu is shown
    expect(screen.getByText("Sign In")).toBeInTheDocument();

    // ACT: Click again to close
    await user.click(menuButton);

    // ASSERT: Verify mobile menu is hidden
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });

  // Test 3: Navbar changes style on scroll
  it("changes appearance when the page is scrolled", async () => {
    // ARRANGE: Render the navbar
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // Get the navbar before scrolling
    const navbar = screen.getByRole("navigation");

    // Verify initial state (transparent background)
    expect(navbar).toHaveClass("bg-transparent");
    expect(navbar).not.toHaveClass("bg-white/95");

    // ACT: Simulate scrolling by changing window.scrollY
    window.scrollY = 20;

    // Trigger the scroll event listener
    fireEvent.scroll(window);

    // ASSERT: Verify navbar style changed
    await waitFor(() => {
      expect(navbar).toHaveClass("bg-white/95");
      expect(navbar).not.toHaveClass("bg-transparent");
    });
  });

  // Test 4: Collections dropdown displays items
  it("displays collections in the dropdown menu when clicked", async () => {
    // ARRANGE: Set up userEvent and render navbar
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // ACT: Find and click the collections dropdown
    const collectionsDropdown = screen.getByText(/collections/i);
    await user.click(collectionsDropdown);

    // ASSERT: Verify collection items are displayed
    expect(screen.getByText("Ethereal")).toBeInTheDocument();
    expect(screen.getByText("Divine")).toBeInTheDocument();
    expect(screen.getByText("Heritage")).toBeInTheDocument();
  });

  // Test 5: Cart shows correct item count
  it("displays the correct number of items in the cart", () => {
    // ARRANGE: Create a mock cart with items
    const mockCart = [
      { _id: "product1", name: "Product 1", quantity: 2 },
      { _id: "product2", name: "Product 2", quantity: 1 },
    ];

    // Custom wrapper to provide mock cart
    const CartWrapper = ({ children }) => (
      <CartContextProvider value={{ cart: mockCart, setCart: jest.fn() }}>
        {children}
      </CartContextProvider>
    );

    // Render navbar with mocked cart context
    render(<Navbar />, { wrapper: CartWrapper });

    // ACT: Find the cart count element
    const cartCount = screen.getByText("3");

    // ASSERT: Verify cart count shows correct total (2+1=3)
    expect(cartCount).toBeInTheDocument();
  });

  // Test 6: Cart dropdown shows empty state
  it("displays empty cart message when cart is empty", async () => {
    // ARRANGE: Set up userEvent and render navbar with empty cart
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // ACT: Click the cart button to show dropdown
    const cartButton = screen.getByLabelText(/shopping cart/i);
    await user.click(cartButton);

    // ASSERT: Verify empty cart message is shown
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("View Cart")).toBeInTheDocument();
  });

  // Test 7: Search button toggles search bar
  it("toggles the search bar when search button is clicked", async () => {
    // ARRANGE: Set up userEvent and render navbar
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // ACT: Find and click the search button
    const searchButton = screen.getByLabelText("Search");
    await user.click(searchButton);

    // ASSERT: Verify search bar is visible
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    expect(searchInput).toBeInTheDocument();

    // ACT: Click search button again
    await user.click(searchButton);

    // ASSERT: Verify search bar is hidden
    expect(
      screen.queryByPlaceholderText("Search for bracelets...")
    ).not.toBeInTheDocument();
  });

  // Test 8: Shows loading state for collections
  it("displays loading state when collections are being fetched", () => {
    // ARRANGE: Mock the collections hook to return loading state
    useCollections.default.mockReturnValueOnce({
      data: [],
      isLoading: true,
      error: null,
    });

    // Render the navbar
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // ACT: Open the collections dropdown
    fireEvent.click(screen.getByText(/collections/i));

    // ASSERT: Verify loading indicator is shown
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Test 9: Shows error state for collections
  it("displays error message when collections fetch fails", () => {
    // ARRANGE: Mock the collections hook to return error state
    useCollections.default.mockReturnValueOnce({
      data: [],
      isLoading: false,
      error: new Error("Failed to load collections"),
    });

    // Render the navbar
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // ACT: Open the collections dropdown
    fireEvent.click(screen.getByText(/collections/i));

    // ASSERT: Verify error message is shown
    expect(screen.getByText("Error loading collections")).toBeInTheDocument();
  });

  // Test 10: Clicking outside closes dropdowns
  it("closes dropdowns when clicking outside", async () => {
    // ARRANGE: Set up userEvent and render navbar
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <Navbar />
      </CartContextProvider>
    );

    // Open the collections dropdown
    await user.click(screen.getByText(/collections/i));

    // Verify dropdown is open
    expect(screen.getByText("Ethereal")).toBeInTheDocument();

    // ACT: Click outside (the document body)
    await user.click(document.body);

    // ASSERT: Verify dropdown is closed
    expect(screen.queryByText("Ethereal")).not.toBeInTheDocument();
  });
});
