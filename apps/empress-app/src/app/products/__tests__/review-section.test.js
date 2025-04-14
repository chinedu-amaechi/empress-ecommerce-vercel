// src/app/products/__tests__/review-section.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewSection from "../review-section";

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <h2 data-level={level}>{children}</h2>,
}));

describe("ReviewSection Component", () => {
  const mockReviews = [
    {
      id: 1,
      name: "Emily R.",
      date: "2023-11-15",
      rating: 5,
      title: "Absolutely stunning!",
      content: "I've received so many compliments on this bracelet.",
      verified: true,
    },
    {
      id: 2,
      name: "Sarah K.",
      date: "2023-10-28",
      rating: 4,
      title: "Beautiful piece",
      content: "Lovely design and quality materials.",
      verified: true,
    },
  ];

  it("renders the heading correctly", () => {
    render(<ReviewSection reviews={mockReviews} rating={4.5} />);

    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
  });

  it("displays overall rating information", () => {
    render(<ReviewSection reviews={mockReviews} rating={4.5} />);

    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("Based on 2 reviews")).toBeInTheDocument();
  });

  it("shows rating breakdown bars", () => {
    render(<ReviewSection reviews={mockReviews} rating={4.5} />);

    // Should have rating bars for each star count
    expect(screen.getByText("5★")).toBeInTheDocument();
    expect(screen.getByText("4★")).toBeInTheDocument();
    expect(screen.getByText("3★")).toBeInTheDocument();
    expect(screen.getByText("2★")).toBeInTheDocument();
    expect(screen.getByText("1★")).toBeInTheDocument();

    // Should show count for each rating
    expect(screen.getByText("1")).toBeInTheDocument(); // 5 star count
    expect(screen.getByText("1")).toBeInTheDocument(); // 4 star count
  });

  it("shows the write review button", () => {
    render(<ReviewSection reviews={mockReviews} rating={4.5} />);

    const writeReviewButton = screen.getByRole("button", {
      name: "Write a Review",
    });
    expect(writeReviewButton).toBeInTheDocument();
  });

  it("displays review sorting options", () => {
    render(<ReviewSection reviews={mockReviews} rating={4.5} />);

    expect(screen.getByText("Sort by:")).toBeInTheDocument();
    const sortSelect = screen.getByRole("combobox");
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveValue("recent");
  });

  it("shows individual reviews with proper formatting", () => {
    render(<ReviewSection reviews={mockReviews} rating={4.5} />);

    // First review
    expect(screen.getByText("Absolutely stunning!")).toBeInTheDocument();
    expect(
      screen.getByText("I've received so many compliments on this bracelet.")
    ).toBeInTheDocument();
    expect(screen.getByText("Emily R.")).toBeInTheDocument();
    expect(screen.getByText("November 15, 2023")).toBeInTheDocument();

    // Second review
    expect(screen.getByText("Beautiful piece")).toBeInTheDocument();
    expect(
      screen.getByText("Lovely design and quality materials.")
    ).toBeInTheDocument();
    expect(screen.getByText("Sarah K.")).toBeInTheDocument();
    expect(screen.getByText("October 28, 2023")).toBeInTheDocument();
  });

  it("toggles review form when write review button is clicked", () => {
    render(<ReviewSection reviews={mockReviews} rating={4.5} />);

    // Review form should not be visible initially
    expect(screen.queryByText("Write a Review")).toBeInTheDocument();
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();

    // Click write review button
    fireEvent.click(screen.getByRole("button", { name: "Write a Review" }));

    // Review form should now be visible
    expect(screen.getByText("Write a Review")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Rating")).toBeInTheDocument();
    expect(screen.getByLabelText("Review Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Review")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit Review" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    // Click cancel button
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    // Review form should be hidden again
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });

  it("handles empty reviews array", () => {
    render(<ReviewSection reviews={[]} rating={0} />);

    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
    expect(screen.getByText("0.0")).toBeInTheDocument();
    expect(screen.getByText("Based on 0 reviews")).toBeInTheDocument();
  });
});
