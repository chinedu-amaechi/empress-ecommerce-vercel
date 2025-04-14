// apps/empress-admin-app/src/ui/__tests__/Modal.test.js (continued)
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../Modal";

describe("Modal Component", () => {
  it("does not render content when closed", () => {
    render(
      <Modal>
        <Modal.Window />
        <Modal.Open content={<div>Modal Content</div>}>
          <button>Open Modal</button>
        </Modal.Open>
      </Modal>,
    );

    // Modal content should not be in the document initially
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("renders content when open button is clicked", () => {
    render(
      <Modal>
        <Modal.Window />
        <Modal.Open content={<div>Modal Content</div>}>
          <button>Open Modal</button>
        </Modal.Open>
      </Modal>,
    );

    // Click the open button
    fireEvent.click(screen.getByText("Open Modal"));

    // Modal content should now be in the document
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", () => {
    render(
      <Modal>
        <Modal.Window />
        <Modal.Open
          content={
            <div>
              Modal Content
              <Modal.Close>
                <button>Close Modal</button>
              </Modal.Close>
            </div>
          }
        >
          <button>Open Modal</button>
        </Modal.Open>
      </Modal>,
    );

    // Open the modal
    fireEvent.click(screen.getByText("Open Modal"));

    // Modal content should be in the document
    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByText("Close Modal"));

    // Modal content should no longer be in the document
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  it("can open different content for different triggers", () => {
    render(
      <Modal>
        <Modal.Window />
        <Modal.Open content={<div>First Modal Content</div>}>
          <button>Open First Modal</button>
        </Modal.Open>
        <Modal.Open content={<div>Second Modal Content</div>}>
          <button>Open Second Modal</button>
        </Modal.Open>
      </Modal>,
    );

    // Open the first modal
    fireEvent.click(screen.getByText("Open First Modal"));
    expect(screen.getByText("First Modal Content")).toBeInTheDocument();

    // Close by clicking outside (simulated by directly manipulating state through internals)
    // In real testing, you'd use fireEvent.click on the modal overlay
    // This is a simplification as direct testing of React portals requires additional setup
    fireEvent.click(document.body);

    // Open the second modal
    fireEvent.click(screen.getByText("Open Second Modal"));
    expect(screen.getByText("Second Modal Content")).toBeInTheDocument();
  });
});
