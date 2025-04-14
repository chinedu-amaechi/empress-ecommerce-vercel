// src/app/collections/__test__/collection-introduction.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import CollectionIntroduction from "../collection-introduction";

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <div data-level={level}>{children}</div>,
}));

describe("CollectionIntroduction Component", () => {
  const mockCollection = {
    name: "Ethereal",
    products: [{ id: "1" }, { id: "2" }, { id: "3" }],
  };

  it("renders the collection name in the heading", () => {
    render(<CollectionIntroduction collection={mockCollection} />);

    expect(screen.getByText("The Essence of")).toBeInTheDocument();
    expect(screen.getByText("Ethereal")).toBeInTheDocument();
  });

  it("displays the collection description", () => {
    render(<CollectionIntroduction collection={mockCollection} />);

    expect(
      screen.getByText(
        /Each piece in the Ethereal collection tells a unique story/
      )
    ).toBeInTheDocument();
  });

  it("shows the correct number of unique pieces", () => {
    render(<CollectionIntroduction collection={mockCollection} />);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Unique Pieces")).toBeInTheDocument();
  });

  it("displays collection stats", () => {
    render(<CollectionIntroduction collection={mockCollection} />);

    expect(screen.getByText("Color Variants")).toBeInTheDocument();
    expect(screen.getByText("Customer Reviews")).toBeInTheDocument();
    expect(screen.getByText("Handcrafted")).toBeInTheDocument();
  });
});
