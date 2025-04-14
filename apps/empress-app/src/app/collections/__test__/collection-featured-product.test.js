// src/app/collections/__test__/collection-featured-product.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import CollectionFeaturedProduct from "../collection-featured-product";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("CollectionFeaturedProduct Component", () => {
  const mockCollection = {
    name: "Ethereal",
    featuredProduct: {
      name: "Celestial Bracelet",
      description: "A beautiful bracelet inspired by the cosmos",
      imagesUrl: [{ optimizeUrl: "/test-image.jpg" }],
      materials: ["Silver", "Moonstone"],
    },
  };

  it("renders the featured product", () => {
    render(<CollectionFeaturedProduct collection={mockCollection} />);

    expect(screen.getByText("Celestial Bracelet")).toBeInTheDocument();
    expect(
      screen.getByText("A beautiful bracelet inspired by the cosmos")
    ).toBeInTheDocument();
  });

  it("displays the featured image", () => {
    render(<CollectionFeaturedProduct collection={mockCollection} />);

    const image = screen.getByAltText("Celestial Bracelet");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });

  it("shows product insights section", () => {
    render(<CollectionFeaturedProduct collection={mockCollection} />);

    expect(screen.getByText("Product Insights")).toBeInTheDocument();
    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("Crafting Time")).toBeInTheDocument();
    expect(screen.getByText("Sustainability")).toBeInTheDocument();
  });

  it("lists the product materials", () => {
    render(<CollectionFeaturedProduct collection={mockCollection} />);

    expect(screen.getByText("Silver")).toBeInTheDocument();
    expect(screen.getByText("Moonstone")).toBeInTheDocument();
  });

  it("displays collection context", () => {
    render(<CollectionFeaturedProduct collection={mockCollection} />);

    expect(
      screen.getByText(
        /Designed to embody the essence of the Ethereal collection/
      )
    ).toBeInTheDocument();
  });
});
