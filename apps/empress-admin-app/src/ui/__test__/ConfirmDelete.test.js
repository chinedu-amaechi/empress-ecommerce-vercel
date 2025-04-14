// apps/empress-admin-app/src/ui/__tests__/ConfirmDelete.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDelete from "../ConfirmDelete";

describe("ConfirmDelete Component", () => {
  const mockOnDelete = jest.fn();
  const mockCloseModal = <button data-testid="close-modal">Cancel</button>;
  const mockItem = { name: "Test Item" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the confirmation dialog with item name", () => {
    render(
      <ConfirmDelete
        item={mockItem}
        closeModal={mockCloseModal}
        onDelete={mockOnDelete}
      />,
    );

    // Check heading
    expect(screen.getByText(`Delete ${mockItem.name}`)).toBeInTheDocument();

    // Check confirmation message
    expect(
      screen.getByText(/Are you sure you want to delete/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockItem.name, { exact: false }),
    ).toBeInTheDocument();

    // Check buttons
    expect(screen.getByTestId("close-modal")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <ConfirmDelete
        item={mockItem}
        closeModal={mockCloseModal}
        onDelete={mockOnDelete}
      />,
    );

    // Click delete button
    fireEvent.click(screen.getByText("Delete"));

    // onDelete should have been called
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("renders closeModal component", () => {
    render(
      <ConfirmDelete
        item={mockItem}
        closeModal={mockCloseModal}
        onDelete={mockOnDelete}
      />,
    );

    // closeModal component should be rendered
    expect(screen.getByTestId("close-modal")).toBeInTheDocument();
  });
});
