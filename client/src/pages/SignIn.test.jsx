import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./SignIn";

const mockNavigate = jest.fn();
const mockSignIn = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../firebase/auth.js", () => ({
  doSignInWithEmailAndPassword: (...args) => mockSignIn(...args),
}));

jest.mock("../components/auth/AuthShell.jsx", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock("../components/auth/SignInFormCard.jsx", () => ({
  __esModule: true,
  default: ({
    email,
    setEmail,
    password,
    setPassword,
    errorMessage,
    isSigningIn,
    handleSubmit,
  }) => (
    <form onSubmit={handleSubmit}>
      <input aria-label="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        aria-label="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">{isSigningIn ? "Signing In..." : "submit"}</button>
      {errorMessage ? <div>{errorMessage}</div> : null}
    </form>
  ),
}));

describe("SignIn page", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockSignIn.mockReset();
  });

  test("shows validation error for empty credentials", async () => {
    render(<SignIn />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/please enter a valid email and password/i)
    ).toBeInTheDocument();
  });

  test("signs in and navigates home", async () => {
    mockSignIn.mockResolvedValue({});

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "pw123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("user@test.com", "pw123");
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("shows auth failure message", async () => {
    mockSignIn.mockRejectedValue(new Error("Bad login"));

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "pw123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/bad login/i)).toBeInTheDocument();
  });
});