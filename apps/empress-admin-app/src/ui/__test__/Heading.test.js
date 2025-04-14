// apps/empress-admin-app/src/ui/__tests__/Heading.test.js
import { render, screen } from "@testing-library/react";
import Heading from "../Heading";

describe("Heading Component", () => {
  it("renders with the correct level and text", () => {
    render(<Heading level={1} text="Test Heading" />);

    const heading = screen.getByText("Test Heading");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
  });

  it("applies custom classes when provided", () => {
    render(
      <Heading level={2} text="Custom Heading" className="custom-class" />,
    );

    const heading = screen.getByText("Custom Heading");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveClass("custom-class");
  });

  it("defaults to level 1 when no level is provided", () => {
    render(<Heading text="Default Level" />);

    const heading = screen.getByText("Default Level");
    expect(heading.tagName).toBe("H1");
  });
});
