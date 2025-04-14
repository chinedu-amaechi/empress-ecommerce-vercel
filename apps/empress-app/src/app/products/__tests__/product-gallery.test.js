// src/app/products/__tests__/product-gallery.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductGallery from "../product-gallery";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("ProductGallery Component", () => {
  const mockImages = [
    "/product-image-1.jpg",
    "/product-image-2.jpg",
    "/product-image-3.jpg",
    "/product-image-4.jpg",
    "/product-image-5.jpg",
  ];

  const productName = "Test Bracelet";

  it("renders the main product image", () => {
    render(<ProductGallery images={mockImages} name={productName} />);

    // Check main image is displayed
    const mainImage = screen.getByAltText(`${productName} - Image 1`);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute("src", mockImages[0]);
  });

  it("displays thumbnails for all images", () => {
    render(<ProductGallery images={mockImages} name={productName} />);

    // Check all thumbnails are displayed
    const thumbnails = screen.getAllByAltText(/Test Bracelet - Thumbnail/);
    expect(thumbnails).toHaveLength(5);

    // Check each thumbnail has the correct src
    thumbnails.forEach((thumb, index) => {
      expect(thumb).toHaveAttribute("src", mockImages[index]);
    });
  });

  it("changes main image when clicking a thumbnail", () => {
    render(<ProductGallery images={mockImages} name={productName} />);

    // Get all thumbnails
    const thumbnails = screen.getAllByAltText(/Test Bracelet - Thumbnail/);

    // Click the third thumbnail (index 2)
    fireEvent.click(thumbnails[2]);

    // Main image should now be the third image
    const mainImage = screen.getByAltText(`${productName} - Image 3`);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute("src", mockImages[2]);
  });

  it("shows zoom indicator when not zoomed", () => {
    render(<ProductGallery images={mockImages} name={productName} />);

    // Zoom indicator is shown initially
    const zoomIndicator = screen.getByLabelText("Open product details");
    expect(zoomIndicator).toBeInTheDocument();
  });

  it("toggles zoom mode when clicking the image", () => {
    render(<ProductGallery images={mockImages} name={productName} />);

    // Get the main image container
    const imageContainer = screen
      .getByAltText(`${productName} - Image 1`)
      .closest("div");

    // Click to zoom in
    fireEvent.click(imageContainer);

    // After clicking, the image should have zoom class
    const zoomedImage = screen.getByAltText(`${productName} - Image 1`);
    expect(zoomedImage.className).toContain("scale-150");

    // Zoom indicator should be hidden
    expect(
      screen.queryByLabelText("Open product details")
    ).not.toBeInTheDocument();

    // Click again to zoom out
    fireEvent.click(imageContainer);

    // After clicking again, zoom class should be removed
    const unzoomedImage = screen.getByAltText(`${productName} - Image 1`);
    expect(unzoomedImage.className).toContain("scale-100");

    // Zoom indicator should be visible again
    expect(screen.getByLabelText("Open product details")).toBeInTheDocument();
  });

  it("uses default image when no images are provided", () => {
    render(<ProductGallery name={productName} />);

    // Should show default image
    const defaultImage = screen.getByAltText(`${productName} - Image 1`);
    expect(defaultImage).toBeInTheDocument();
    expect(defaultImage).toHaveAttribute(
      "src",
      "/products/default-product.jpg"
    );
  });

  it("handles mouse move for zoom positioning", () => {
    render(<ProductGallery images={mockImages} name={productName} />);

    // Get the main image container
    const imageContainer = screen
      .getByAltText(`${productName} - Image 1`)
      .closest("div");

    // Click to zoom in
    fireEvent.click(imageContainer);

    // Mock getBoundingClientRect for the container
    imageContainer.getBoundingClientRect = jest.fn().mockReturnValue({
      left: 100,
      top: 100,
      width: 500,
      height: 500,
    });

    // Trigger mouse move
    fireEvent.mouseMove(imageContainer, {
      clientX: 350, // 50% from left
      clientY: 350, // 50% from top
    });

    // After moving mouse, transform origin should be updated
    const zoomedImage = screen.getByAltText(`${productName} - Image 1`);
    expect(zoomedImage.style.transformOrigin).toBe("50% 50%");

    // Move mouse to different position
    fireEvent.mouseMove(imageContainer, {
      clientX: 600, // 100% from left
      clientY: 200, // 20% from top
    });

    // Transform origin should be updated again
    expect(zoomedImage.style.transformOrigin).toBe("100% 20%");
  });

  it("removes zoom on mouse leave", () => {
    render(<ProductGallery images={mockImages} name={productName} />);

    // Get the main image container
    const imageContainer = screen
      .getByAltText(`${productName} - Image 1`)
      .closest("div");

    // Click to zoom in
    fireEvent.click(imageContainer);

    // Verify it's zoomed
    expect(screen.getByAltText(`${productName} - Image 1`).className).toContain(
      "scale-150"
    );

    // Mouse leave should unzoom when zoom is active
    fireEvent.mouseLeave(imageContainer);

    // Should unzoom on mouse leave
    expect(screen.getByAltText(`${productName} - Image 1`).className).toContain(
      "scale-100"
    );
  });
});
