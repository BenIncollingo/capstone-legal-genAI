import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateAccountPage from "./Create";

const mockNavigate = jest.fn();
const mockCreateUser = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../firebase/auth.js", () => ({
  doCreateUserWithEmailAndPassword: (...args) => mockCreateUser(...args),
}));

jest.mock("../components/auth/AuthShell.jsx", () => ({
  __esModule: true,
  default: ({ children, heroProps }) => (
    <div>
      <div>{heroProps.badge}</div>
      <div>{heroProps.title}</div>
      <div>{heroProps.description}</div>
      {children}
    </div>
  ),
}));

jest.mock("../components/auth/CreateAccountFormCard.jsx", () => ({
  __esModule: true,
  default: ({
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    successMessage,
    isCreating,
    handleSubmit,
  }) => (
    <form onSubmit={handleSubmit}>
      <input
        aria-label="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        aria-label="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        aria-label="confirm-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">{isCreating ? "Creating..." : "submit"}</button>
      {errorMessage ? <div>{errorMessage}</div> : null}
      {successMessage ? <div>{successMessage}</div> : null}
    </form>
  ),
}));

describe("CreateAccountPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders hero content and form", () => {
    render(<CreateAccountPage />);

    expect(screen.getByText("New account")).toBeInTheDocument();
    expect(
      screen.getByText(/Create your account and start building the workflow/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText("email")).toBeInTheDocument();
    expect(screen.getByLabelText("password")).toBeInTheDocument();
    expect(screen.getByLabelText("confirm-password")).toBeInTheDocument();
  });

  test("shows validation error for empty credentials", async () => {
    render(<CreateAccountPage />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/please enter valid credentials/i)
    ).toBeInTheDocument();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("shows validation error for overly long email", async () => {
    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "a".repeat(31) },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/please enter valid credentials/i)
    ).toBeInTheDocument();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("shows validation error for overly long password", async () => {
    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "a".repeat(31) },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "a".repeat(31) },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/please enter valid credentials/i)
    ).toBeInTheDocument();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("shows error when passwords do not match", async () => {
    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "xyz789" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test("creates account with trimmed email and redirects", async () => {
    mockCreateUser.mockResolvedValue({});

    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "  user@test.com  " },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith("user@test.com", "abc123");
    });

    expect(
      screen.getByText(/account created! redirecting/i)
    ).toBeInTheDocument();

    jest.advanceTimersByTime(1200);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("resets isCreating back to false after success", async () => {
    let resolveCreate;
    mockCreateUser.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve;
        })
    );

    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByRole("button", { name: /creating/i })).toBeInTheDocument();

    resolveCreate({});

    await waitFor(() => {
      expect(
        screen.getByText(/account created! redirecting/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("maps auth/email-already-in-use error", async () => {
    mockCreateUser.mockRejectedValue({ code: "auth/email-already-in-use" });

    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/email already in use/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("maps auth/invalid-email error", async () => {
    mockCreateUser.mockRejectedValue({ code: "auth/invalid-email" });

    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "bad-email" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  test("maps auth/weak-password error", async () => {
    mockCreateUser.mockRejectedValue({ code: "auth/weak-password" });

    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/password is too weak/i)).toBeInTheDocument();
  });

  test("shows default error for unknown failure", async () => {
    mockCreateUser.mockRejectedValue({ code: "unknown-error" });

    render(<CreateAccountPage />);

    fireEvent.change(screen.getByLabelText("email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("password"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("confirm-password"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/failed to create account/i)
    ).toBeInTheDocument();
  });
});