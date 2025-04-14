// src/app/collections/__test__/collection-navigation-header.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CollectionNavigationHeader from "../collection-navigation-header";

// Sample test data
const mockCollectionsData = {
  ethereal: { name: "Ethereal", description: "Delicate designs" },
  divine: { name: "Divine", description: "Bold statements" },
  heritage: { name: "Heritage", description: "Timeless craftsmanship" },
};

describe("CollectionNavigationHeader Component", () => {
  // Test 1: Renders all collection buttons
  it("renders buttons for all collections", () => {
    // ARRANGE: Render the component with collections data
    render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={false}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find all collection buttons
    const etherealButton = screen.getByRole("button", { name: /ethereal/i });
    const divineButton = screen.getByRole("button", { name: /divine/i });
    const heritageButton = screen.getByRole("button", { name: /heritage/i });

    // ASSERT: Verify all collection buttons are rendered
    expect(etherealButton).toBeInTheDocument();
    expect(divineButton).toBeInTheDocument();
    expect(heritageButton).toBeInTheDocument();
  });

  // Test 2: Highlights active collection
  it("applies highlight styles to the active collection button", () => {
    // ARRANGE: Render the component with an active collection
    render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Divine" }}
        isScrolled={false}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find all collection buttons
    const etherealButton = screen.getByRole("button", { name: /ethereal/i });
    const divineButton = screen.getByRole("button", { name: /divine/i });
    const heritageButton = screen.getByRole("button", { name: /heritage/i });

    // ASSERT: Verify only the active collection has highlight styling
    expect(divineButton).toHaveClass("text-white");
    expect(divineButton).toHaveClass("bg-gray-500/50");
    expect(divineButton).toHaveClass("font-medium");

    expect(etherealButton).not.toHaveClass("bg-gray-500/50");
    expect(heritageButton).not.toHaveClass("bg-gray-500/50");
  });

  // Test 3: Calls change handler when collection is selected
  it("calls onHandleCollectionChange when a collection button is clicked", async () => {
    // ARRANGE: Create a mock change handler and render the component
    const mockChangeHandler = jest.fn();
    const user = userEvent.setup();

    render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={false}
        onHandleCollectionChange={mockChangeHandler}
      />
    );

    // ACT: Click on a different collection button
    const divineButton = screen.getByRole("button", { name: /divine/i });
    await user.click(divineButton);

    // ASSERT: Verify the change handler was called with the correct collection name
    expect(mockChangeHandler).toHaveBeenCalledWith("Divine");
  });

  // Test 4: Changes styles based on scroll state (not scrolled)
  it("applies transparent styling when not scrolled", () => {
    // ARRANGE: Render the component with isScrolled=false
    render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={false}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find the container element
    const container = screen
      .getByRole("button", { name: /ethereal/i })
      .closest("div").parentElement;

    // ASSERT: Verify transparent styling
    expect(container).toHaveClass("bg-white/10");
    expect(container).toHaveClass("border-white/20");
    expect(container).not.toHaveClass("bg-gray-100");
    expect(container).not.toHaveClass("border-gray-300");
    expect(container).not.toHaveClass("shadow-sm");
  });

  // Test 5: Changes styles based on scroll state (scrolled)
  it("applies solid styling when scrolled", () => {
    // ARRANGE: Render the component with isScrolled=true
    render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={true}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find the container element
    const container = screen
      .getByRole("button", { name: /ethereal/i })
      .closest("div").parentElement;

    // ASSERT: Verify solid styling
    expect(container).toHaveClass("bg-gray-100");
    expect(container).toHaveClass("border-gray-300");
    expect(container).toHaveClass("shadow-sm");
    expect(container).not.toHaveClass("bg-white/10");
    expect(container).not.toHaveClass("border-white/20");
  });

  // Test 6: Active collection styling changes based on scroll state
  it("changes active collection styling based on scroll state", () => {
    // ARRANGE: Set up test for non-scrolled state
    const { rerender } = render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={false}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find the active button (not scrolled)
    const activeButtonNotScrolled = screen.getByRole("button", {
      name: /ethereal/i,
    });

    // ASSERT: Verify active styling for not scrolled state
    expect(activeButtonNotScrolled).toHaveClass("text-white");
    expect(activeButtonNotScrolled).toHaveClass("bg-gray-500/50");
    expect(activeButtonNotScrolled).not.toHaveClass("bg-amber-300");

    // ARRANGE: Rerender for scrolled state
    rerender(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={true}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find the active button (scrolled)
    const activeButtonScrolled = screen.getByRole("button", {
      name: /ethereal/i,
    });

    // ASSERT: Verify active styling for scrolled state
    expect(activeButtonScrolled).toHaveClass("text-[#11296B]");
    expect(activeButtonScrolled).toHaveClass("bg-amber-300");
    expect(activeButtonScrolled).not.toHaveClass("bg-gray-500/50");
    expect(activeButtonScrolled).not.toHaveClass("text-white");
  });

  // Test 7: Container position and alignment
  it("has correct container alignment and position", () => {
    // ARRANGE: Render the component
    render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={false}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find the root container
    const rootContainer = screen
      .getByRole("button", { name: /ethereal/i })
      .closest("div").parentElement.parentElement;

    // ASSERT: Verify alignment and positioning classes
    expect(rootContainer).toHaveClass("md:w-1/3");
    expect(rootContainer).toHaveClass("flex");
    expect(rootContainer).toHaveClass("justify-end");
  });

  // Test 8: Applies transition effects
  it("applies transition effects for smooth style changes", () => {
    // ARRANGE: Render the component
    render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={false}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find the navigation container
    const container = screen
      .getByRole("button", { name: /ethereal/i })
      .closest("div").parentElement;

    // ASSERT: Verify transition effects are applied
    expect(container).toHaveClass("transition-all");
    expect(container).toHaveClass("duration-500");
  });

  // Test 9: Handles no collections data gracefully
  it("handles empty collections data gracefully", () => {
    // ARRANGE: Render with empty collections data
    render(
      <CollectionNavigationHeader
        collectionsData={{}}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={false}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Check for the container
    const container = document.querySelector(".backdrop-blur-md");

    // ASSERT: Verify the component still renders
    expect(container).toBeInTheDocument();
    // There should be no collection buttons
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  // Test 10: Buttons have proper hover effects
  it("applies hover effects to collection buttons", () => {
    // ARRANGE: Render the component
    render(
      <CollectionNavigationHeader
        collectionsData={mockCollectionsData}
        activeCollection={{ name: "Ethereal" }}
        isScrolled={true}
        onHandleCollectionChange={() => {}}
      />
    );

    // ACT: Find an inactive button
    const divineButton = screen.getByRole("button", { name: /divine/i });

    // ASSERT: Verify the hover classes
    expect(divineButton).toHaveClass("hover:text-[#11296B]");
    expect(divineButton).toHaveClass("hover:bg-gray-200");
  });
});
