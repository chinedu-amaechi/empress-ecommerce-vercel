// apps/empress-admin-app/src/ui/__tests__/Spinner.test.js
import { render, screen } from "@testing-library/react";
import Spinner from "../Spinner";

describe("Spinner Component", () => {
  it("renders the loading spinner", () => {
    render(<Spinner />);

    // Check if the spinner div is rendered
    const spinnerElement = screen.getByRole("status");
    expect(spinnerElement).toBeInTheDocument();

    // Check spinner has animation class
    expect(spinnerElement).toHaveClass("animate-spin");

    // Check spinner has proper dimensions
    expect(spinnerElement).toHaveClass("h-16");
    expect(spinnerElement).toHaveClass("w-16");
  });

  it("is centered on the screen", () => {
    render(<Spinner />);

    // Check if the spinner is wrapped in a centered container
    const containerElement = screen.getByRole("status").parentElement;
    expect(containerElement).toHaveClass("flex");
    expect(containerElement).toHaveClass("items-center");
    expect(containerElement).toHaveClass("justify-center");
    expect(containerElement).toHaveClass("h-screen");
  });
});
