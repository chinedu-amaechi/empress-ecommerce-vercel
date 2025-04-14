// src/components/ui/__test__/heading.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import Heading from "../heading";
import { activeFont } from "../fonts";

// Mock the activeFont to avoid importing actual font files
jest.mock("../fonts", () => ({
  activeFont: {
    className: "mock-font-class",
  },
}));

describe("Heading Component", () => {
  // Test 1: Renders the correct HTML heading element based on level prop
  it("renders the correct heading level HTML element", () => {
    // ARRANGE: Set up a series of headings with different levels
    const { rerender } = render(<Heading level={1}>Heading 1</Heading>);

    // ACT: Find the heading element in the DOM
    let headingElement = screen.getByText("Heading 1");

    // ASSERT: Verify the correct HTML element is used
    expect(headingElement.tagName).toBe("H1");

    // Test other heading levels
    rerender(<Heading level={2}>Heading 2</Heading>);
    headingElement = screen.getByText("Heading 2");
    expect(headingElement.tagName).toBe("H2");

    rerender(<Heading level={3}>Heading 3</Heading>);
    headingElement = screen.getByText("Heading 3");
    expect(headingElement.tagName).toBe("H3");

    rerender(<Heading level={4}>Heading 4</Heading>);
    headingElement = screen.getByText("Heading 4");
    expect(headingElement.tagName).toBe("H4");

    rerender(<Heading level={5}>Heading 5</Heading>);
    headingElement = screen.getByText("Heading 5");
    expect(headingElement.tagName).toBe("H5");

    rerender(<Heading level={6}>Heading 6</Heading>);
    headingElement = screen.getByText("Heading 6");
    expect(headingElement.tagName).toBe("H6");
  });

  // Test 2: Renders h1 by default when no level is provided
  it("renders as h1 by default when no level is specified", () => {
    // ARRANGE: Set up a heading without specifying level
    render(<Heading>Default Heading</Heading>);

    // ACT: Find the heading element
    const headingElement = screen.getByText("Default Heading");

    // ASSERT: Verify it's an H1 element
    expect(headingElement.tagName).toBe("H1");
  });

  // Test 3: Applies the correct sizing classes for different levels
  it("applies the correct size classes for each heading level", () => {
    // ARRANGE: Create headings of different levels
    const { rerender } = render(<Heading level={1}>Heading 1</Heading>);

    // ACT: Find the heading element
    let headingElement = screen.getByText("Heading 1");

    // ASSERT: Verify heading 1 has the right classes
    expect(headingElement).toHaveClass("text-2xl");
    expect(headingElement).toHaveClass("md:text-4xl");
    expect(headingElement).toHaveClass("font-bold");

    // Test heading 2 classes
    rerender(<Heading level={2}>Heading 2</Heading>);
    headingElement = screen.getByText("Heading 2");
    expect(headingElement).toHaveClass("text-lg");
    expect(headingElement).toHaveClass("md:text-xl");
    expect(headingElement).toHaveClass("font-semibold");

    // Test heading 3 classes
    rerender(<Heading level={3}>Heading 3</Heading>);
    headingElement = screen.getByText("Heading 3");
    expect(headingElement).toHaveClass("text-base");
    expect(headingElement).toHaveClass("md:text-lg");
    expect(headingElement).toHaveClass("font-semibold");

    // Test heading 4 classes
    rerender(<Heading level={4}>Heading 4</Heading>);
    headingElement = screen.getByText("Heading 4");
    expect(headingElement).toHaveClass("text-sm");
    expect(headingElement).toHaveClass("md:text-base");
    expect(headingElement).toHaveClass("font-semibold");
  });

  // Test 4: Applies the font class from the active font
  it("applies the active font class to the heading", () => {
    // ARRANGE: Render a heading
    render(<Heading>Font Test Heading</Heading>);

    // ACT: Find the heading element
    const headingElement = screen.getByText("Font Test Heading");

    // ASSERT: Verify it has the font class from the mocked activeFont
    expect(headingElement).toHaveClass("mock-font-class");
  });

  // Test 5: Allows custom className to be added
  it("applies additional CSS classes when provided", () => {
    // ARRANGE: Render heading with custom class
    render(
      <Heading className="custom-heading text-blue-500">Custom Heading</Heading>
    );

    // ACT: Find the heading element
    const headingElement = screen.getByText("Custom Heading");

    // ASSERT: Verify it has both the default and custom classes
    expect(headingElement).toHaveClass("custom-heading");
    expect(headingElement).toHaveClass("text-blue-500");
    expect(headingElement).toHaveClass("mock-font-class"); // Should still have font class
    // Should still have default classes for h1
    expect(headingElement).toHaveClass("text-2xl");
    expect(headingElement).toHaveClass("md:text-4xl");
  });

  // Test 6: Handles invalid level gracefully
  it("defaults to h6 styling when an invalid level is provided", () => {
    // ARRANGE: Render heading with invalid level
    render(<Heading level={10}>Invalid Level Heading</Heading>);

    // ACT: Find the heading element (it will be an h10)
    const headingElement = screen.getByText("Invalid Level Heading");

    // ASSERT: Verify it has h6 styling as fallback
    expect(headingElement.tagName).toBe("H10"); // Tag will still be what was requested
    expect(headingElement).toHaveClass("text-xs"); // But styles will be from h6
    expect(headingElement).toHaveClass("md:text-sm");
    expect(headingElement).toHaveClass("font-semibold");
  });

  // Test 7: Renders children correctly
  it("renders children content correctly", () => {
    // ARRANGE: Render heading with different types of children
    render(
      <Heading>
        Simple text and <span data-testid="nested-element">nested element</span>
      </Heading>
    );

    // ACT: Find the heading and nested element
    const headingElement = screen.getByRole("heading", { level: 1 });
    const nestedElement = screen.getByTestId("nested-element");

    // ASSERT: Verify content is rendered correctly
    expect(headingElement).toHaveTextContent("Simple text and nested element");
    expect(nestedElement).toBeInTheDocument();
    expect(nestedElement).toHaveTextContent("nested element");
  });

  // Test 8: Passes through additional props
  it("passes through additional props to the heading element", () => {
    // ARRANGE: Render heading with additional props
    render(
      <Heading
        data-testid="test-heading"
        aria-label="Important heading"
        id="main-heading"
      >
        Props Test
      </Heading>
    );

    // ACT: Find the heading element
    const headingElement = screen.getByTestId("test-heading");

    // ASSERT: Verify the additional props are applied
    expect(headingElement).toHaveAttribute("aria-label", "Important heading");
    expect(headingElement).toHaveAttribute("id", "main-heading");
  });

  // Test 9: Can create a visually hidden heading for accessibility
  it("can be visually hidden while remaining accessible", () => {
    // ARRANGE: Render heading with sr-only class
    render(<Heading className="sr-only">Screen Reader Only Heading</Heading>);

    // ACT: Find the heading element
    const headingElement = screen.getByText("Screen Reader Only Heading");

    // ASSERT: Verify it has the screen reader only class
    expect(headingElement).toHaveClass("sr-only");
    // Screen reader text should still be an appropriate heading
    expect(headingElement.tagName).toBe("H1");
  });

  // Test 10: Applies specified heading level even when className overrides some styles
  it("maintains correct heading semantics even with style overrides", () => {
    // ARRANGE: Render heading with classes that might override styles
    render(
      <Heading level={2} className="text-4xl font-normal text-red-500">
        Custom Styled Heading
      </Heading>
    );

    // ACT: Find the heading element
    const headingElement = screen.getByText("Custom Styled Heading");

    // ASSERT: Verify it's still the correct heading level
    expect(headingElement.tagName).toBe("H2");
    // Custom styles are applied
    expect(headingElement).toHaveClass("text-4xl");
    expect(headingElement).toHaveClass("font-normal");
    expect(headingElement).toHaveClass("text-red-500");
  });
});
