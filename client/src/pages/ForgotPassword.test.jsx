import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "./ForgotPassword";

const mockReset = jest.fn();

jest.mock("../firebase/auth.js", () => ({
  doPasswordReset: (...args) => mockReset(...args),
}));

jest.mock("../components/auth/AuthShell.jsx", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock("../components/auth/ForgotPasswordFormCard.jsx", () => ({
  __esModule: true,
  default: ({
    email,
    setEmail,
    errorMessage,
    successMessage,
    isResetting,
    handleSubmit,
  }) => (
    <form onSubmit={handleSubmit}>
      <input aria-label="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">{isResetting ? "Sending..." : "submit"}</button>
      {errorMessage ? <div>{errorMessage}</div> : null}
      {successMessage ? <div>{successMessage}</div> : null}
    </form>
  ),
}));

describe("ForgotPassword page", () => {
  beforeEach(() => {
    mockReset.mockReset();
  });

  test("shows validation error for empty email", async () => {
    render(<ForgotPassword />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  test("resets password and clears input", async () => {
    mockReset.mockResolvedValue({});

    render(<ForgotPassword />);

    const emailInput = screen.getByLabelText("email");
    fireEvent.change(emailInput, {
      target: { value: "user@test.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith("user@test.com");
    });

    expect(await screen.findByText(/password reset email sent/i)).toBeInTheDocument();
    expect(emailInput).toHaveValue("");
  });

  test("shows failure message", async () => {
    mockReset.mockRejectedValue(new Error("Reset failed"));

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/reset failed/i)).toBeInTheDocument();
  });
});