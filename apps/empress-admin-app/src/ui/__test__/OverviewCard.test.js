// apps/empress-admin-app/src/ui/__tests__/OverviewCard.test.js
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OverviewCard from "../OverviewCard";

describe("OverviewCard Component", () => {
  it("renders children content", () => {
    render(
      <OverviewCard>
        <h2>Card Title</h2>
        <p>Card content</p>
      </OverviewCard>,
    );

    // Check that children content is rendered
    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders with link when cardLink and linkText are provided", () => {
    render(
      <BrowserRouter>
        <OverviewCard cardLink="/test-link" linkText="View More">
          <p>Card content</p>
        </OverviewCard>
      </BrowserRouter>,
    );

    // Check that the link is rendered with correct text and href
    const linkElement = screen.getByText("View More");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe("A");
    expect(linkElement).toHaveAttribute("href", "/test-link");

    // Check that content is still rendered
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("does not render link when cardLink and linkText are not provided", () => {
    render(
      <OverviewCard>
        <p>Card content</p>
      </OverviewCard>,
    );

    // Link should not be present
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    // Content should still be rendered
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("has proper styling classes", () => {
    render(<OverviewCard>Test</OverviewCard>);

    // Get the main card container
    const cardElement = screen.getByText("Test").parentElement;

    // Check for expected styling classes
    expect(cardElement).toHaveClass("rounded-lg");
    expect(cardElement).toHaveClass("bg-[#ffffff]");
    expect(cardElement).toHaveClass("shadow-md");

    // Check for hover effect classes
    expect(cardElement).toHaveClass("hover:scale-105");
    expect(cardElement).toHaveClass("hover:shadow-lg");
  });
});
