// src/app/about-us/__test__/page.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import AboutUs from "../page";

// Mock the component imports
jest.mock("@/components/ui/navbar", () => {
  return () => <div data-testid="navbar">Navbar Component</div>;
});

jest.mock("@/components/layout/footer", () => {
  return () => <div data-testid="footer">Footer Component</div>;
});

// Mock all the imported components from index.js
jest.mock("../index", () => ({
  AboutHero: () => <div data-testid="about-hero">About Hero Component</div>,
  OurPhilosophy: () => (
    <div data-testid="our-philosophy">Our Philosophy Component</div>
  ),
  OurStory: () => <div data-testid="our-story">Our Story Component</div>,
  OurArtisans: () => (
    <div data-testid="our-artisans">Our Artisans Component</div>
  ),
  OurValues: () => <div data-testid="our-values">Our Values Component</div>,
  CtaSection: () => <div data-testid="cta-section">CTA Section Component</div>,
}));

describe("AboutUs Page", () => {
  it("renders the main layout components", () => {
    render(<AboutUs />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders all about-us sections in the correct order", () => {
    render(<AboutUs />);

    const components = screen.getAllByTestId(
      /about-hero|our-philosophy|our-story|our-artisans|our-values|cta-section/
    );

    expect(components[0]).toHaveTextContent("About Hero Component");
    expect(components[1]).toHaveTextContent("Our Philosophy Component");
    expect(components[2]).toHaveTextContent("Our Story Component");
    expect(components[3]).toHaveTextContent("Our Artisans Component");
    expect(components[4]).toHaveTextContent("Our Values Component");
    expect(components[5]).toHaveTextContent("CTA Section Component");
  });
});
