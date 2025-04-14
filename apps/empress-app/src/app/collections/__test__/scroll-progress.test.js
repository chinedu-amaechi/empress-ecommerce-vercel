// src/app/collections/__test__/scroll-progress.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollProgress from "../scroll-progress";

describe("ScrollProgress Component", () => {
  // Test 1: Component renders correctly
  it("renders the scroll progress bar", () => {
    // ARRANGE: Render the component
    render(<ScrollProgress />);

    // ACT: Find the progress bar element
    const progressBar = document.querySelector(".h-1.bg-amber-400");

    // ASSERT: Verify the progress bar exists with correct styling
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass("h-full");
    expect(progressBar).toHaveClass("bg-amber-400");
    expect(progressBar).toHaveClass("transition-all");
  });

  // Test 2: Updates progress when scrolling
  it("updates progress width when scrolling", () => {
    // ARRANGE: Mock document dimensions for scroll calculation
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 1000,
      configurable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 500,
      configurable: true,
    });

    // Initial scroll position
    Object.defineProperty(window, "scrollY", {
      value: 0,
      configurable: true,
      writable: true,
    });

    // Render the component
    render(<ScrollProgress />);

    // Find the progress bar
    const progressBar = document.querySelector(".bg-amber-400");

    // ASSERT: Initial state - no scroll, 0% width
    expect(progressBar).toHaveStyle("width: 0%");

    // ACT: Simulate scrolling halfway down the page
    window.scrollY = 250; // Half of the scrollable area (1000 - 500 = 500, half is 250)
    fireEvent.scroll(window);

    // ASSERT: Progress should be 50%
    expect(progressBar).toHaveStyle("width: 50%");

    // ACT: Simulate scrolling to the bottom
    window.scrollY = 500; // Full scroll (1000 - 500 = 500)
    fireEvent.scroll(window);

    // ASSERT: Progress should be 100%
    expect(progressBar).toHaveStyle("width: 100%");
  });

  // Test 3: Fixed position at top of viewport
  it("is fixed at the top of the viewport", () => {
    // ARRANGE: Render the component
    render(<ScrollProgress />);

    // ACT: Find the container element
    const container = document.querySelector(".fixed.top-0");

    // ASSERT: Verify fixed positioning styling
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("fixed");
    expect(container).toHaveClass("top-0");
    expect(container).toHaveClass("left-0");
    expect(container).toHaveClass("right-0");
    expect(container).toHaveClass("z-50"); // High z-index to stay on top
  });

  // Test 4: Component cleans up event listeners
  it("removes the scroll event listener when unmounted", () => {
    // ARRANGE: Spy on window event handlers
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    // ACT: Render and unmount the component
    const { unmount } = render(<ScrollProgress />);

    // ASSERT: Verify event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    // ACT: Unmount the component
    unmount();

    // ASSERT: Verify event listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    // Clean up spies
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  // Test 5: Applies transition effects
  it("applies transition effects for smooth progress updates", () => {
    // ARRANGE: Render the component
    render(<ScrollProgress />);

    // ACT: Find the progress bar
    const progressBar = document.querySelector(".bg-amber-400");

    // ASSERT: Verify transition styling for smooth progress updates
    expect(progressBar).toHaveClass("transition-all");
    expect(progressBar).toHaveClass("duration-150");
    expect(progressBar).toHaveClass("ease-out");
  });

  // Test 6: Handles edge case with short pages
  it("handles edge case when page is not scrollable", () => {
    // ARRANGE: Mock document dimensions where page is not scrollable
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 500, // Same as window height
      configurable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 500,
      configurable: true,
    });

    // Render the component
    render(<ScrollProgress />);

    // Find the progress bar
    const progressBar = document.querySelector(".bg-amber-400");

    // ACT: Simulate scrolling (which won't actually happen)
    window.scrollY = 10; // Trying to scroll, but page doesn't scroll
    fireEvent.scroll(window);

    // ASSERT: Progress should be 100% since the page is fully visible
    // Note: Different implementations might handle this case differently
    // Some might show 0% (no progress needed), others 100% (fully scrolled)
    expect(progressBar).toHaveStyle("width: 100%");
  });

  // Test 7: Recalculates on window resize
  it("recalculates progress when window is resized", () => {
    // ARRANGE: Mock initial document dimensions
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 1000,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 500,
      configurable: true,
      writable: true,
    });

    window.scrollY = 250; // Half of scrollable area

    // Render the component
    render(<ScrollProgress />);

    // Find the progress bar
    const progressBar = document.querySelector(".bg-amber-400");

    // Trigger initial scroll to set progress
    fireEvent.scroll(window);

    // ASSERT: Initial progress should be 50%
    expect(progressBar).toHaveStyle("width: 50%");

    // ACT: Change document dimensions to simulate resize
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000, // Double the height
      configurable: true,
    });

    // Trigger resize event
    fireEvent.resize(window);

    // Trigger scroll event (which would recalculate progress)
    fireEvent.scroll(window);

    // ASSERT: Progress should now be 25% (250 / (2000-500))
    expect(progressBar).toHaveStyle("width: 25%");
  });
});
