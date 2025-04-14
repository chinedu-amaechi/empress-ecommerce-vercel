// src/app/products/__tests__/product-tabs.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductTabs from "../product-tabs";

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <h3 data-level={level}>{children}</h3>,
}));

describe("ProductTabs Component", () => {
  const mockProduct = {
    description: "A beautiful bracelet with intricate design",
    materials: ["Silver", "Moonstone"],
    meaning: "Represents inner peace and balance",
  };

  it("renders the description tab by default", () => {
    render(<ProductTabs product={mockProduct} />);

    // Description tab should be active
    expect(screen.getByText("Description")).toHaveClass("border-[#11296B]");

    // Description content should be visible
    expect(
      screen.getByText("A beautiful bracelet with intricate design")
    ).toBeInTheDocument();
    expect(screen.getByText("Meaning")).toBeInTheDocument();
    expect(
      screen.getByText("Represents inner peace and balance")
    ).toBeInTheDocument();
  });

  it("switches to materials tab when clicked", () => {
    render(<ProductTabs product={mockProduct} />);

    // Click on Materials tab
    fireEvent.click(screen.getByText("Materials"));

    // Materials tab should now be active
    expect(screen.getByText("Materials")).toHaveClass("border-[#11296B]");

    // Materials content should be visible
    expect(
      screen.getByText(
        /Each Empress bracelet is crafted using only the finest materials/
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Materials used:")).toBeInTheDocument();
    expect(screen.getByText("Silver")).toBeInTheDocument();
    expect(screen.getByText("Moonstone")).toBeInTheDocument();
    expect(screen.getByText("Our Commitment to Quality")).toBeInTheDocument();
  });

  it("switches to shipping tab when clicked", () => {
    render(<ProductTabs product={mockProduct} />);

    // Click on Shipping & Returns tab
    fireEvent.click(screen.getByText("Shipping & Returns"));

    // Shipping tab should now be active
    expect(screen.getByText("Shipping & Returns")).toHaveClass(
      "border-[#11296B]"
    );

    // Shipping content should be visible
    expect(screen.getByText("Standard Shipping")).toBeInTheDocument();
    expect(screen.getByText("Express Shipping")).toBeInTheDocument();
    expect(screen.getByText("Returns & Exchanges")).toBeInTheDocument();
    expect(
      screen.getByText(/We accept returns and exchanges within 30 days/)
    ).toBeInTheDocument();
  });

  it("switches to care tab when clicked", () => {
    render(<ProductTabs product={mockProduct} />);

    // Click on Care Instructions tab
    fireEvent.click(screen.getByText("Care Instructions"));

    // Care tab should now be active
    expect(screen.getByText("Care Instructions")).toHaveClass(
      "border-[#11296B]"
    );

    // Care content should be visible
    expect(screen.getByText("Daily Wear")).toBeInTheDocument();
    expect(screen.getByText("Cleaning")).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(
      screen.getByText(/Remove before showering or swimming/)
    ).toBeInTheDocument();
  });

  it("works with empty product data", () => {
    render(<ProductTabs product={{}} />);

    // Description should show default text
    expect(screen.getByText("No description available.")).toBeInTheDocument();

    // Click on Materials tab
    fireEvent.click(screen.getByText("Materials"));

    // Should show empty state for materials
    expect(
      screen.getByText("Material information not available.")
    ).toBeInTheDocument();
  });
});
