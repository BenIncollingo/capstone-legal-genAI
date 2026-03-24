import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DocumentsPage from "../pages/DocumentUploadPage.jsx";
import SignIn from "../pages/SignIn.jsx";
import Create from "../pages/Create.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import Assistant from "../pages/LawGPT.jsx";
import TestHome from "../pages/testHome.jsx";

// ─── Mocks ──────────────────────────────────────────────────
jest.mock("../firebase/auth.js", () => ({
  doSignInWithEmailAndPassword: jest.fn(),
  doCreateUserWithEmailAndPassword: jest.fn(),
  doPasswordReset: jest.fn(),
  doSignOut: jest.fn(),
}));

jest.mock("../firebase/firebase.js", () => ({}));

jest.mock("../contexts/authContext/index.jsx", () => ({
  useAuth: () => ({
    currentUser: { email: "test@test.com" },
    userLoggedIn: true,
  }),
}));

jest.mock("../labor-law.jpg", () => "labor-law.jpg");

jest.mock("../api/documents.api", () => ({
  uploadDocumentToBackend: jest.fn(),
}));

jest.mock("../api/chat.api", () => ({
  uploadChatToBackend: jest.fn(),
}));

jest.mock("../components/DataButton", () => () => <button>Fetch Data</button>);

import { uploadDocumentToBackend } from "../api/documents.api.js";
import { uploadChatToBackend } from "../api/chat.api.js";
import { doSignInWithEmailAndPassword, doCreateUserWithEmailAndPassword, doPasswordReset } from "../firebase/auth.js";

// ─── Suppress noisy console output across all tests ─────────
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  window.alert = jest.fn();
});

afterAll(() => {
  console.error.mockRestore();
  console.warn.mockRestore();
});

// ─── Router helper with React Router v7 future flags ────────
const renderWithRouter = (ui) =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {ui}
    </MemoryRouter>
  );

// ============================================================
// 1. Validation logic — SignIn

const MAX_CREDENTIAL_LENGTH = 30;

function validateSignIn(email, password) {
  if (!email || !password || email.length > MAX_CREDENTIAL_LENGTH || password.length > MAX_CREDENTIAL_LENGTH) {
    return "Please enter a valid email and password.";
  }
  return null;
}

describe("SignIn validation", () => {
  test("returns error when email is empty", () => {
    expect(validateSignIn("", "password123")).toBeTruthy();
  });
  test("returns error when password is empty", () => {
    expect(validateSignIn("user@test.com", "")).toBeTruthy();
  });
  test("returns error when email exceeds max length", () => {
    expect(validateSignIn("a".repeat(31) + "@test.com", "pass")).toBeTruthy();
  });
  test("returns error when password exceeds max length", () => {
    expect(validateSignIn("user@test.com", "a".repeat(31))).toBeTruthy();
  });
  test("returns null for valid credentials", () => {
    expect(validateSignIn("user@test.com", "securePass1")).toBeNull();
  });
});

// 2. Validation logic — Create
const MAXCREDENTIALLENGTH = 30;

function validateCreate(email, password, retypePassword) {
  if (!email || !password || email.length > MAXCREDENTIALLENGTH || password.length > MAXCREDENTIALLENGTH) {
    return "invalid credentials";
  }
  if (password !== retypePassword) return "passwords must match";
  return null;
}

describe("Create account validation", () => {
  test("returns error when email is empty", () => {
    expect(validateCreate("", "pass123", "pass123")).toBeTruthy();
  });
  test("returns error when password is empty", () => {
    expect(validateCreate("a@b.com", "", "")).toBeTruthy();
  });
  test("returns error when passwords do not match", () => {
    expect(validateCreate("a@b.com", "pass1", "pass2")).toBe("passwords must match");
  });
  test("returns error when email exceeds max length", () => {
    expect(validateCreate("a".repeat(31), "pass", "pass")).toBeTruthy();
  });
  test("returns null for valid matching credentials", () => {
    expect(validateCreate("a@b.com", "pass123", "pass123")).toBeNull();
  });
});

// 3. Validation logic — ForgotPassword
function validateForgotPassword(email) {
  if (!email || email.length > MAXCREDENTIALLENGTH) {
    return "Please enter a valid email.";
  }
  return null;
}

describe("ForgotPassword validation", () => {
  test("returns error when email is empty", () => {
    expect(validateForgotPassword("")).toBeTruthy();
  });
  test("returns error when email exceeds max length", () => {
    expect(validateForgotPassword("a".repeat(31) + "@b.com")).toBeTruthy();
  });
  test("returns null for a valid email", () => {
    expect(validateForgotPassword("user@example.com")).toBeNull();
  });
});

// 4. formatSize helper — DocumentUploadPage

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

describe("formatSize", () => {
  test("formats bytes correctly", () => { expect(formatSize(500)).toBe("500 B"); });
  test("formats kilobytes correctly", () => { expect(formatSize(2048)).toBe("2.0 KB"); });
  test("formats megabytes correctly", () => { expect(formatSize(1048576)).toBe("1.0 MB"); });
  test("formats 0 bytes", () => { expect(formatSize(0)).toBe("0 B"); });
  test("formats a large file", () => { expect(formatSize(5 * 1024 * 1024)).toBe("5.0 MB"); });
});


// 5. DocumentUploadPage component

describe("DocumentsPage component", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders the upload page heading", () => {
    render(<DocumentsPage />);
    expect(screen.getByText("Upload Documents")).toBeInTheDocument();
  });
  test("shows empty staging area message initially", () => {
    render(<DocumentsPage />);
    expect(screen.getByText("No files added yet.")).toBeInTheDocument();
  });
  test("upload button is disabled when no files staged", () => {
    render(<DocumentsPage />);
    expect(screen.getByText("Upload All (0)")).toBeDisabled();
  });
  test("clear button is disabled when no files staged", () => {
    render(<DocumentsPage />);
    expect(screen.getByText("Clear Unuploaded Files")).toBeDisabled();
  });
  test("adds a file to the staging area", async () => {
    render(<DocumentsPage />);
    const input = document.querySelector("input[type='file']");
    fireEvent.change(input, { target: { files: [new File(["c"], "test.pdf", { type: "application/pdf" })] } });
    await waitFor(() => expect(screen.getByText("test.pdf")).toBeInTheDocument());
  });
  test("shows Staged status after adding a file", async () => {
    render(<DocumentsPage />);
    const input = document.querySelector("input[type='file']");
    fireEvent.change(input, { target: { files: [new File(["c"], "test.pdf", { type: "application/pdf" })] } });
    await waitFor(() => expect(screen.getByText("Staged")).toBeInTheDocument());
  });
  test("removes a file when Remove is clicked", async () => {
    render(<DocumentsPage />);
    const input = document.querySelector("input[type='file']");
    fireEvent.change(input, { target: { files: [new File(["c"], "remove-me.pdf", { type: "application/pdf" })] } });
    await waitFor(() => screen.getByText("remove-me.pdf"));
    fireEvent.click(screen.getByText("Remove"));
    await waitFor(() => expect(screen.queryByText("remove-me.pdf")).not.toBeInTheDocument());
  });
  test("shows Uploaded status after successful upload", async () => {
    uploadDocumentToBackend.mockResolvedValueOnce({ savedTo: "/testInfraDB/test.pdf" });
    render(<DocumentsPage />);
    const input = document.querySelector("input[type='file']");
    fireEvent.change(input, { target: { files: [new File(["c"], "test.pdf", { type: "application/pdf" })] } });
    await waitFor(() => screen.getByText("test.pdf"));
    fireEvent.click(screen.getByText("Upload All (1)"));
    await waitFor(() => expect(screen.getByText("Uploaded")).toBeInTheDocument());
  });
  test("shows Failed status when upload throws an error", async () => {
    uploadDocumentToBackend.mockRejectedValueOnce(new Error("Server error"));
    render(<DocumentsPage />);
    const input = document.querySelector("input[type='file']");
    fireEvent.change(input, { target: { files: [new File(["c"], "fail.pdf", { type: "application/pdf" })] } });
    await waitFor(() => screen.getByText("fail.pdf"));
    fireEvent.click(screen.getByText("Upload All (1)"));
    await waitFor(() => expect(screen.getByText("Failed")).toBeInTheDocument());
  });
  test("clears staged files when Clear is clicked", async () => {
    render(<DocumentsPage />);
    const input = document.querySelector("input[type='file']");
    fireEvent.change(input, { target: { files: [new File(["c"], "staged.pdf", { type: "application/pdf" })] } });
    await waitFor(() => screen.getByText("staged.pdf"));
    fireEvent.click(screen.getByText("Clear Unuploaded Files"));
    await waitFor(() => expect(screen.queryByText("staged.pdf")).not.toBeInTheDocument());
  });
});


// 6. SignIn component

describe("SignIn component", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders the Sign In button", () => {
    renderWithRouter(<SignIn />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });
  test("renders email and password inputs", () => {
    renderWithRouter(<SignIn />);
    expect(screen.getByPlaceholderText("email@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });
  test("renders Forgot Password link", () => {
    renderWithRouter(<SignIn />);
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
  });
  test("shows error when submitting empty fields", async () => {
    renderWithRouter(<SignIn />);
    fireEvent.click(screen.getByText("Sign In"));
    await waitFor(() =>
      expect(screen.getByText("Please enter a valid email and password.")).toBeInTheDocument()
    );
  });
  test("calls doSignInWithEmailAndPassword with correct credentials", async () => {
    doSignInWithEmailAndPassword.mockResolvedValueOnce({});
    renderWithRouter(<SignIn />);
    fireEvent.change(screen.getByPlaceholderText("email@example.com"), { target: { value: "user@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByText("Sign In"));
    await waitFor(() =>
      expect(doSignInWithEmailAndPassword).toHaveBeenCalledWith("user@test.com", "password123")
    );
  });
  test("shows error message when Firebase sign in fails", async () => {
    doSignInWithEmailAndPassword.mockRejectedValueOnce(new Error("Invalid credentials"));
    renderWithRouter(<SignIn />);
    fireEvent.change(screen.getByPlaceholderText("email@example.com"), { target: { value: "user@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByText("Sign In"));
    await waitFor(() =>
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    );
  });
});


// 7. Create component

describe("Create component", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders Create an account heading", () => {
    renderWithRouter(<Create />);
    expect(screen.getByText("Create an account:")).toBeInTheDocument();
  });
  test("renders email password and retype inputs", () => {
    renderWithRouter(<Create />);
    expect(screen.getByPlaceholderText("email@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Retype Password")).toBeInTheDocument();
  });
  test("renders Create Account button", () => {
    renderWithRouter(<Create />);
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });
  test("calls doCreateUserWithEmailAndPassword on valid submit", async () => {
    doCreateUserWithEmailAndPassword.mockResolvedValueOnce({});
    renderWithRouter(<Create />);
    fireEvent.change(screen.getByPlaceholderText("email@example.com"), { target: { value: "newuser@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Retype Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByText("Create Account"));
    await waitFor(() =>
      expect(doCreateUserWithEmailAndPassword).toHaveBeenCalledWith("newuser@test.com", "password123")
    );
  });
});


// 8. ForgotPassword component

describe("ForgotPassword component", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders the heading", () => {
    renderWithRouter(<ForgotPassword />);
    expect(screen.getByText(/Forgot your password/i)).toBeInTheDocument();
  });
  test("renders email input", () => {
    renderWithRouter(<ForgotPassword />);
    expect(screen.getByPlaceholderText("email@example.com")).toBeInTheDocument();
  });
  test("renders Reset Password button", () => {
    renderWithRouter(<ForgotPassword />);
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
  });
  test("calls doPasswordReset with the correct email", async () => {
    doPasswordReset.mockResolvedValueOnce({});
    renderWithRouter(<ForgotPassword />);
    fireEvent.change(screen.getByPlaceholderText("email@example.com"), { target: { value: "user@test.com" } });
    fireEvent.click(screen.getByText("Reset Password"));
    await waitFor(() =>
      expect(doPasswordReset).toHaveBeenCalledWith("user@test.com")
    );
  });
  test("clears email field after successful reset", async () => {
    doPasswordReset.mockResolvedValueOnce({});
    renderWithRouter(<ForgotPassword />);
    const input = screen.getByPlaceholderText("email@example.com");
    fireEvent.change(input, { target: { value: "user@test.com" } });
    fireEvent.click(screen.getByText("Reset Password"));
    await waitFor(() => expect(input.value).toBe(""));
  });
});


// 9. LawGPT component

describe("LawGPT (Assistant) component", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders the LegalAI Assistant heading", () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText("LegalAI Assistant")).toBeInTheDocument();
  });
  test("renders the message input", () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByPlaceholderText("Ask a legal question...")).toBeInTheDocument();
  });
  test("renders suggestion cards", () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText("Contract Review")).toBeInTheDocument();
    expect(screen.getByText("Legal Rights")).toBeInTheDocument();
  });
  test("renders the disclaimer", () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText(/Disclaimer/i)).toBeInTheDocument();
  });
  test("clicking a suggestion fills the input", () => {
    renderWithRouter(<Assistant />);
    fireEvent.click(screen.getByText("Contract Review"));
    expect(screen.getByPlaceholderText("Ask a legal question...").value).toBe(
      "What are the key elements of a valid contract?"
    );
  });
  test("sends a message and shows it in the chat", async () => {
    uploadChatToBackend.mockResolvedValueOnce({ response: "Here is the answer." });
    renderWithRouter(<Assistant />);
    fireEvent.change(screen.getByPlaceholderText("Ask a legal question..."), { target: { value: "What is a contract?" } });
    fireEvent.click(screen.getByLabelText("Send"));
    await waitFor(() => expect(screen.getByText("What is a contract?")).toBeInTheDocument());
  });
  test("shows bot reply after sending a message", async () => {
    uploadChatToBackend.mockResolvedValueOnce({ response: "A contract is a legal agreement." });
    renderWithRouter(<Assistant />);
    fireEvent.change(screen.getByPlaceholderText("Ask a legal question..."), { target: { value: "What is a contract?" } });
    fireEvent.click(screen.getByLabelText("Send"));
    await waitFor(() => expect(screen.getByText("A contract is a legal agreement.")).toBeInTheDocument());
  });
  test("shows fallback message when API call fails", async () => {
    uploadChatToBackend.mockRejectedValueOnce(new Error("Network error"));
    renderWithRouter(<Assistant />);
    fireEvent.change(screen.getByPlaceholderText("Ask a legal question..."), { target: { value: "What is a contract?" } });
    fireEvent.click(screen.getByLabelText("Send"));
    await waitFor(() => expect(screen.getByText("Something went wrong getting a response.")).toBeInTheDocument());
  });
  test("shows user email in sidebar", () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
  });
});


// 10. TestHome component

describe("TestHome component", () => {
  test("renders Legal Bot header", () => {
    renderWithRouter(<TestHome />);
    expect(screen.getByText("Legal Bot")).toBeInTheDocument();
  });
  test("renders Sign In heading", () => {
    renderWithRouter(<TestHome />);
    expect(screen.getByText("Sign In:")).toBeInTheDocument();
  });
  test("renders Go to LawGPT link", () => {
    renderWithRouter(<TestHome />);
    expect(screen.getByText("Go to LawGPT Page")).toBeInTheDocument();
  });
  test("renders Next step card", () => {
    renderWithRouter(<TestHome />);
    expect(screen.getByText("Next step")).toBeInTheDocument();
  });
  test("renders UI polish card", () => {
    renderWithRouter(<TestHome />);
    expect(screen.getByText("UI polish")).toBeInTheDocument();
  });
});