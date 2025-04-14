// src/app/collections/__test__/collection-navigator.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CollectionNavigator from "../collection-navigator";

// Mock icons
jest.mock("lucide-react", () => ({
  ArrowLeftCircle: () => <div data-testid="arrow-left" />,
  ArrowRightCircle: () => <div data-testid="arrow-right" />,
}));

describe("CollectionNavigator Component", () => {
  const mockCollections = [
    { name: "Ethereal", _id: "1" },
    { name: "Divine", _id: "2" },
    { name: "Heritage", _id: "3" },
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders previous and next collection buttons", () => {
    render(
      <CollectionNavigator
        collections={mockCollections}
        currentCollection={mockCollections[1]}
        onNavigate={mockNavigate}
      />
    );

    expect(screen.getByText(/Previous: Ethereal/)).toBeInTheDocument();
    expect(screen.getByText(/Next: Heritage/)).toBeInTheDocument();
    expect(screen.getByTestId("arrow-left")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-right")).toBeInTheDocument();
  });

  it("disables previous button for first collection", () => {
    render(
      <CollectionNavigator
        collections={mockCollections}
        currentCollection={mockCollections[0]}
        onNavigate={mockNavigate}
      />
    );

    expect(screen.getByText(/No Previous Collection/)).toBeInTheDocument();
    expect(screen.getByText(/Next: Divine/)).toBeInTheDocument();

    const prevButton = screen
      .getByText(/No Previous Collection/)
      .closest("button");
    expect(prevButton).toBeDisabled();
  });

  it("disables next button for last collection", () => {
    render(
      <CollectionNavigator
        collections={mockCollections}
        currentCollection={mockCollections[2]}
        onNavigate={mockNavigate}
      />
    );

    expect(screen.getByText(/Previous: Divine/)).toBeInTheDocument();
    expect(screen.getByText(/No Next Collection/)).toBeInTheDocument();

    const nextButton = screen.getByText(/No Next Collection/).closest("button");
    expect(nextButton).toBeDisabled();
  });

  it("calls onNavigate when clicking previous button", () => {
    render(
      <CollectionNavigator
        collections={mockCollections}
        currentCollection={mockCollections[1]}
        onNavigate={mockNavigate}
      />
    );

    fireEvent.click(screen.getByText(/Previous: Ethereal/));
    expect(mockNavigate).toHaveBeenCalledWith("Ethereal");
  });

  it("calls onNavigate when clicking next button", () => {
    render(
      <CollectionNavigator
        collections={mockCollections}
        currentCollection={mockCollections[1]}
        onNavigate={mockNavigate}
      />
    );

    fireEvent.click(screen.getByText(/Next: Heritage/));
    expect(mockNavigate).toHaveBeenCalledWith("Heritage");
  });
});
