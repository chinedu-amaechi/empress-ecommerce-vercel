// src/components/chatbot/__test__/empress-chatbot.test.js
import React from "react";
import { render } from "@testing-library/react";
import EmpressChatbot from "../empress-chatbot";

describe("EmpressChatbot Component", () => {
  // Mock document.body.appendChild
  const originalAppendChild = document.body.appendChild;
  let appendedElements = [];

  beforeEach(() => {
    // Set up the mock for appendChild
    appendedElements = [];
    document.body.appendChild = jest.fn((element) => {
      appendedElements.push(element);
      return element;
    });
  });

  afterEach(() => {
    // Restore original function
    document.body.appendChild = originalAppendChild;
  });

  it("loads Botpress script tags when mounted", () => {
    render(<EmpressChatbot />);

    // Check that the expected script tags were created
    expect(appendedElements.length).toBe(2);

    // Check first script (inject.js)
    expect(appendedElements[0].tagName).toBe("SCRIPT");
    expect(appendedElements[0].src).toContain("webchat/v2.2/inject.js");
    expect(appendedElements[0].async).toBe(true);

    // Check second script (config script)
    expect(appendedElements[1].tagName).toBe("SCRIPT");
    expect(appendedElements[1].src).toContain("20250312012516-4FC8KSAY.js");
    expect(appendedElements[1].async).toBe(true);
  });

  it("renders nothing visible to the DOM", () => {
    const { container } = render(<EmpressChatbot />);
    expect(container.firstChild).toBeNull();
  });
});
