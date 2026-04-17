import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsPage from "./Settings";

const mockNavigate = jest.fn();
const mockDeleteUserAccount = jest.fn();
const mockDoPasswordReset = jest.fn();
const mockGetAuth = jest.fn();
const mockReauthenticateWithCredential = jest.fn();
const mockCredential = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../firebase/auth", () => ({
  doPasswordReset: (...args) => mockDoPasswordReset(...args),
  deleteUserAccount: (...args) => mockDeleteUserAccount(...args),
}));

jest.mock("firebase/auth", () => ({
  getAuth: (...args) => mockGetAuth(...args),
  EmailAuthProvider: {
    credential: (...args) => mockCredential(...args),
  },
  reauthenticateWithCredential: (...args) =>
    mockReauthenticateWithCredential(...args),
}));

jest.mock("../components/Settings/SettingsHero.jsx", () => ({
  __esModule: true,
  default: () => <div>hero</div>,
}));

jest.mock("../components/Settings/TermsPanel.jsx", () => ({
  __esModule: true,
  default: () => <div>terms panel</div>,
}));

jest.mock("../components/Settings/NavigationPanel.jsx", () => ({
  __esModule: true,
  default: ({ onUpload, onLibrary }) => (
    <div>
      <button onClick={onUpload}>go upload</button>
      <button onClick={onLibrary}>go library</button>
    </div>
  ),
}));

jest.mock("../components/Settings/SettingsTabs.jsx", () => ({
  __esModule: true,
  default: ({ tabs, activeTab, setActiveTab }) => (
    <div>
      <div data-testid="tabs-count">{tabs.length}</div>
      <div data-testid="active-tab">{activeTab}</div>
      <button onClick={() => setActiveTab("profile")}>profile tab</button>
      <button onClick={() => setActiveTab("terms")}>terms tab</button>
      <button onClick={() => setActiveTab("documents")}>documents tab</button>
    </div>
  ),
}));

jest.mock("../components/Settings/ProfileSettingsPanel.jsx", () => ({
  __esModule: true,
  default: ({ setPassword, checkPass, onDeleteAccount, onReset }) => (
    <div>
      <button onClick={() => setPassword("secret")}>set password</button>
      <button onClick={async () => await checkPass()}>check password</button>
      <button onClick={onDeleteAccount}>delete account</button>
      <button onClick={onReset}>reset password</button>
    </div>
  ),
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockGetAuth.mockReturnValue({
      currentUser: { email: "user@test.com" },
    });
    mockCredential.mockReturnValue("cred");
    mockReauthenticateWithCredential.mockResolvedValue({});
    mockDoPasswordReset.mockResolvedValue({});
    mockDeleteUserAccount.mockResolvedValue({});
  });

  afterEach(() => {
    window.alert.mockRestore();
    window.confirm.mockRestore();
    console.error.mockRestore();
  });

  test("renders tabs with expected props", () => {
    render(<SettingsPage />);

    expect(screen.getByTestId("tabs-count")).toHaveTextContent("3");
    expect(screen.getByTestId("active-tab")).toHaveTextContent("profile");
    expect(screen.getByText("hero")).toBeInTheDocument();
  });

  test("checks password successfully", async () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByText("set password"));
    fireEvent.click(screen.getByText("check password"));

    await waitFor(() => {
      expect(mockCredential).toHaveBeenCalledWith("user@test.com", "secret");
      expect(mockReauthenticateWithCredential).toHaveBeenCalledWith(
        { email: "user@test.com" },
        "cred"
      );
    });
  });

  test("returns false and logs when no authenticated user exists", async () => {
    mockGetAuth
      .mockReturnValueOnce({ currentUser: { email: "user@test.com" } })
      .mockReturnValueOnce({ currentUser: null });

    render(<SettingsPage />);

    fireEvent.click(screen.getByText("check password"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("No authenticated user");
    });

    expect(mockReauthenticateWithCredential).not.toHaveBeenCalled();
  });

  test("returns false and logs when reauthentication fails", async () => {
    mockReauthenticateWithCredential.mockRejectedValue({
      code: "auth/wrong-password",
      message: "Wrong password",
    });

    render(<SettingsPage />);

    fireEvent.click(screen.getByText("set password"));
    fireEvent.click(screen.getByText("check password"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Re-auth failed:",
        "auth/wrong-password",
        "Wrong password"
      );
    });
  });

  test("deletes account and navigates to login when confirmed", async () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByText("delete account"));

    await waitFor(() => {
      expect(mockDeleteUserAccount).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("does not delete account when confirm is false", () => {
    window.confirm.mockImplementation(() => false);

    render(<SettingsPage />);

    fireEvent.click(screen.getByText("delete account"));

    expect(mockDeleteUserAccount).not.toHaveBeenCalled();
  });

  test("logs delete error when delete fails", async () => {
    const err = new Error("delete failed");
    mockDeleteUserAccount.mockRejectedValue(err);

    render(<SettingsPage />);

    fireEvent.click(screen.getByText("delete account"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(err);
    });
  });

  test("resets password for current user", async () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByText("reset password"));

    await waitFor(() => {
      expect(mockDoPasswordReset).toHaveBeenCalledWith("user@test.com");
    });

    expect(window.alert).toHaveBeenCalledWith("Password reset email sent.");
  });

  test("returns early when user has no email", () => {
    mockGetAuth.mockReturnValue({ currentUser: null });

    render(<SettingsPage />);

    fireEvent.click(screen.getByText("reset password"));

    expect(mockDoPasswordReset).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  test("alerts on password reset failure", async () => {
    const err = new Error("reset failed");
    mockDoPasswordReset.mockRejectedValue(err);

    render(<SettingsPage />);

    fireEvent.click(screen.getByText("reset password"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(err);
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Failed to send password reset email."
    );
  });

  test("switches to terms tab", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByText("terms tab"));

    expect(screen.getByText("terms panel")).toBeInTheDocument();
  });

  test("switches to documents tab and navigates", () => {
    render(<SettingsPage />);

    fireEvent.click(screen.getByText("documents tab"));
    fireEvent.click(screen.getByText("go upload"));
    fireEvent.click(screen.getByText("go library"));

    expect(mockNavigate).toHaveBeenCalledWith("/documentUpload");
    expect(mockNavigate).toHaveBeenCalledWith("/documentLibrary");
  });
});