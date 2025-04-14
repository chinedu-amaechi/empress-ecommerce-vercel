// apps/empress-admin-app/src/contexts/__tests__/AuthContext.test.js
import { render, screen, act } from "@testing-library/react";
import { AuthContextProvider, useAuthContext } from "../AuthContext";

// Create a test component that uses the context
const TestComponent = () => {
  const { user, setUser } = useAuthContext();

  return (
    <div>
      <div data-testid="user-value">{JSON.stringify(user)}</div>
      <button
        onClick={() => setUser({ id: "123", name: "Test User" })}
        data-testid="set-user-btn"
      >
        Set User
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  it("provides the user value and setter function", () => {
    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>,
    );

    // Initially, user should be null
    expect(screen.getByTestId("user-value")).toHaveTextContent("null");

    // After clicking the button, user should be updated
    act(() => {
      screen.getByTestId("set-user-btn").click();
    });

    expect(screen.getByTestId("user-value")).toHaveTextContent(
      '{"id":"123","name":"Test User"}',
    );
  });

  it("throws an error when used outside of AuthContextProvider", () => {
    // Mock console.error to avoid cluttering test output
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAuthContext must be used within an AuthContext");

    // Restore console.error
    console.error = originalError;
  });
});
