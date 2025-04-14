// src/components/layout/__test__/footer.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../footer";

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Footer Component", () => {
  beforeEach(() => {
    // Mock the current year
    jest.spyOn(Date.prototype, "getFullYear").mockImplementation(() => 2025);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the footer logo", () => {
    render(<Footer />);

    const logo = screen.getByAltText("Empress Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/Icons/empress_logo_white.png");
  });

  it("displays social media links", () => {
    render(<Footer />);

    // Check all social media icons
    const instagramIcon = screen.getByAltText("Instagram");
    expect(instagramIcon).toBeInTheDocument();
    expect(instagramIcon.closest("a")).toHaveAttribute(
      "href",
      "https://www.instagram.com/_empressofficial_/"
    );

    const tiktokIcon = screen.getByAltText("Instagram");
    expect(tiktokIcon).toBeInTheDocument();
    expect(tiktokIcon.closest("a")).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@empresscanada"
    );

    const etsyIcon = screen.getByAltText("Etsy");
    expect(etsyIcon).toBeInTheDocument();
    expect(etsyIcon.closest("a")).toHaveAttribute(
      "href",
      "https://empresscanada.etsy.com"
    );
  });

  it("contains all main navigation links", () => {
    render(<Footer />);

    // Shop links
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Collections").closest("a")).toHaveAttribute(
      "href",
      "/collections"
    );
    expect(screen.getByText("New Arrivals").closest("a")).toHaveAttribute(
      "href",
      "/new-arrivals"
    );
    expect(screen.getByText("Bestsellers").closest("a")).toHaveAttribute(
      "href",
      "/bestsellers"
    );
    expect(screen.getByText("All Products").closest("a")).toHaveAttribute(
      "href",
      "/all-products"
    );

    // Company links
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("About Us").closest("a")).toHaveAttribute(
      "href",
      "/about-us"
    );
    expect(screen.getByText("Contact Us").closest("a")).toHaveAttribute(
      "href",
      "/contact"
    );
    expect(screen.getByText("FAQ").closest("a")).toHaveAttribute(
      "href",
      "/faq"
    );
  });

  it("shows the copyright notice with current year", () => {
    render(<Footer />);

    expect(
      screen.getByText("© 2025 Empress. All rights reserved.")
    ).toBeInTheDocument();
  });
});
