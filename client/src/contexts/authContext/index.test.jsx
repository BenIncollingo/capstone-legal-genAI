import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./index";

const mockOnAuthStateChanged = jest.fn();

jest.mock("../../firebase/firebase", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
}));

function Consumer() {
  const value = useAuth();

  return (
    <div>
      <div data-testid="logged-in">{String(value.userLoggedIn)}</div>
      <div data-testid="email">{value.currentUser?.email || "none"}</div>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    mockOnAuthStateChanged.mockReset();
  });

  test("does not render children until auth state resolves", () => {
    mockOnAuthStateChanged.mockImplementation(() => jest.fn());

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(screen.queryByTestId("logged-in")).not.toBeInTheDocument();
  });

  test("renders logged-in user after auth callback", async () => {
    let authCallback;
    mockOnAuthStateChanged.mockImplementation((auth, cb) => {
      authCallback = cb;
      return jest.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await act(async () => {
      await authCallback({ email: "user@example.com", uid: "u1" });
    });

    expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
    expect(screen.getByTestId("email")).toHaveTextContent("user@example.com");
  });

  test("renders logged-out state after null auth callback", async () => {
    let authCallback;
    mockOnAuthStateChanged.mockImplementation((auth, cb) => {
      authCallback = cb;
      return jest.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await act(async () => {
      await authCallback(null);
    });

    expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
    expect(screen.getByTestId("email")).toHaveTextContent("none");
  });
});