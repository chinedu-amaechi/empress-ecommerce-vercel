// src/components/ui/__test__/button.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../button";

describe("Button Component", () => {
  // Test 1: Renders the button with correct text
  it("renders with the provided children text", () => {
    // ARRANGE: Set up the component with test props
    render(<Button>Click Me</Button>);

    // ACT: Find the button in the DOM
    const buttonElement = screen.getByRole("button", { name: /click me/i });

    // ASSERT: Verify the button exists and has correct text
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent("Click Me");
  });

  // Test 2: Applies the correct classes for styling
  it("applies the expected CSS classes for styling", () => {
    // ARRANGE: Render the button
    render(<Button>Test Button</Button>);

    // ACT: Get the button element
    const buttonElement = screen.getByRole("button", { name: /test button/i });

    // ASSERT: Check for CSS classes that define the button's appearance
    expect(buttonElement).toHaveClass("w-full");
    expect(buttonElement).toHaveClass("bg-[#11296B]");
    expect(buttonElement).toHaveClass("hover:bg-[#1E96FC]");
    expect(buttonElement).toHaveClass("text-white");
    expect(buttonElement).toHaveClass("font-medium");
    expect(buttonElement).toHaveClass("py-2.5");
    expect(buttonElement).toHaveClass("rounded-lg");
    expect(buttonElement).toHaveClass("transition-colors");
  });

  // Test 3: Handles click events
  it("triggers the onClick handler when clicked", async () => {
    // ARRANGE: Create a mock function to track clicks
    const handleClick = jest.fn();
    const user = userEvent.setup();

    // Render the button with the click handler
    render(<Button onClick={handleClick}>Click Me</Button>);

    // ACT: Find the button and click it
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    await user.click(buttonElement);

    // ASSERT: Verify the click handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 4: Handles button types correctly
  it("renders with the specified button type attribute", () => {
    // ARRANGE: Render a button with a specific type
    render(<Button type="submit">Submit</Button>);

    // ACT: Find the button
    const buttonElement = screen.getByRole("button", { name: /submit/i });

    // ASSERT: Verify the type attribute is set correctly
    expect(buttonElement).toHaveAttribute("type", "submit");
  });

  // Test 5: Can be disabled
  it("can be disabled and shows disabled styling", () => {
    // ARRANGE: Render a disabled button
    render(<Button disabled>Disabled Button</Button>);

    // ACT: Find the button
    const buttonElement = screen.getByRole("button", {
      name: /disabled button/i,
    });

    // ASSERT: Verify it has the disabled attribute and appropriate styling
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass("opacity-50");
    expect(buttonElement).toHaveClass("cursor-not-allowed");
  });

  // Test 6: Accepts additional CSS classes
  it("applies additional CSS classes when provided", () => {
    // ARRANGE: Render button with additional CSS class
    render(<Button className="custom-class">Custom Button</Button>);

    // ACT: Find the button
    const buttonElement = screen.getByRole("button", {
      name: /custom button/i,
    });

    // ASSERT: Verify it has both default and custom classes
    expect(buttonElement).toHaveClass("custom-class");
    expect(buttonElement).toHaveClass("w-full"); // Should still have default classes
    expect(buttonElement).toHaveClass("bg-[#11296B]");
  });

  // Test 7: Renders as a link when href is provided
  it("renders as an anchor element when href is provided", () => {
    // ARRANGE: Render button with href prop
    render(<Button href="/test-page">Link Button</Button>);

    // ACT: Find the element (now an anchor)
    const linkElement = screen.getByRole("link", { name: /link button/i });

    // ASSERT: Verify it's rendered as a link with proper attributes
    expect(linkElement.tagName).toBe("A");
    expect(linkElement).toHaveAttribute("href", "/test-page");
    expect(linkElement).toHaveClass("w-full"); // Should still have styling classes
    expect(linkElement).toHaveClass("bg-[#11296B]");
  });

  // Test 8: Renders custom element when 'as' prop is provided
  it("renders as a custom element when 'as' prop is specified", () => {
    // ARRANGE: Render button as a div element
    render(
      <Button as="div" data-testid="custom-element">
        Custom Element
      </Button>
    );

    // ACT: Find the custom element
    const customElement = screen.getByTestId("custom-element");

    // ASSERT: Verify it's rendered as specified element with proper content
    expect(customElement.tagName).toBe("DIV");
    expect(customElement).toHaveTextContent("Custom Element");
    expect(customElement).toHaveClass("w-full"); // Should still have styling classes
  });

  // Test 9: Passes through additional props
  it("passes through additional props to the button element", () => {
    // ARRANGE: Render button with additional props
    render(
      <Button
        data-testid="test-button"
        aria-label="Test Button"
        title="Button Title"
      >
        Props Test
      </Button>
    );

    // ACT: Find the button
    const buttonElement = screen.getByTestId("test-button");

    // ASSERT: Verify the additional props are applied
    expect(buttonElement).toHaveAttribute("aria-label", "Test Button");
    expect(buttonElement).toHaveAttribute("title", "Button Title");
  });

  // Test 10: Renders children correctly even when they're not simple text
  it("renders complex children correctly", () => {
    // ARRANGE: Render button with nested elements
    render(
      <Button>
        <span data-testid="icon">🔍</span>
        <span data-testid="text">Search</span>
      </Button>
    );

    // ACT: Find the elements within the button
    const iconElement = screen.getByTestId("icon");
    const textElement = screen.getByTestId("text");

    // ASSERT: Verify the complex children structure is preserved
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveTextContent("🔍");
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent("Search");
  });
});
