import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignOut,
  doPasswordReset,
  doPasswordChange,
  doSendEmailVerification,
  deleteUserAccount,
} from "./auth";

// --- MOCKS ---

const mockCreateUser = jest.fn();
const mockSignIn = jest.fn();
const mockResetEmail = jest.fn();
const mockUpdatePassword = jest.fn();
const mockVerifyEmail = jest.fn();
const mockDeleteUser = jest.fn();

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args) => mockCreateUser(...args),
  signInWithEmailAndPassword: (...args) => mockSignIn(...args),
  sendPasswordResetEmail: (...args) => mockResetEmail(...args),
  updatePassword: (...args) => mockUpdatePassword(...args),
  sendEmailVerification: (...args) => mockVerifyEmail(...args),
  deleteUser: (...args) => mockDeleteUser(...args),
}));

const mockSignOut = jest.fn();

jest.mock("./firebase", () => ({
  auth: {
    currentUser: { uid: "user-1" },
    signOut: (...args) => mockSignOut(...args),
  },
}));

// --- TESTS ---

describe("firebase auth wrappers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates user with email and password", async () => {
    mockCreateUser.mockResolvedValue("created");

    const result = await doCreateUserWithEmailAndPassword("a@test.com", "123");

    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.any(Object),
      "a@test.com",
      "123"
    );
    expect(result).toBe("created");
  });

  test("signs in user with email and password", async () => {
    mockSignIn.mockResolvedValue("signed-in");

    const result = await doSignInWithEmailAndPassword("a@test.com", "123");

    expect(mockSignIn).toHaveBeenCalledWith(
      expect.any(Object),
      "a@test.com",
      "123"
    );
    expect(result).toBe("signed-in");
  });

  test("signs out user", async () => {
    mockSignOut.mockResolvedValue("done");

    const result = await doSignOut();

    expect(mockSignOut).toHaveBeenCalled();
    expect(result).toBe("done");
  });

  test("sends password reset email", async () => {
    mockResetEmail.mockResolvedValue("reset");

    const result = await doPasswordReset("a@test.com");

    expect(mockResetEmail).toHaveBeenCalledWith(
      expect.any(Object),
      "a@test.com"
    );
    expect(result).toBe("reset");
  });

  test("changes password for current user", async () => {
    mockUpdatePassword.mockResolvedValue("updated");

    const result = await doPasswordChange("newpass");

    expect(mockUpdatePassword).toHaveBeenCalledWith(
      expect.any(Object),
      "newpass"
    );
    expect(result).toBe("updated");
  });

  test("sends email verification with correct URL", async () => {
    mockVerifyEmail.mockResolvedValue("sent");

    const result = await doSendEmailVerification();

    expect(mockVerifyEmail).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        url: expect.stringContaining("/home"),
      })
    );

    expect(result).toBe("sent");
  });

  test("deletes current user account", async () => {
    mockDeleteUser.mockResolvedValue("deleted");

    const result = await deleteUserAccount();

    expect(mockDeleteUser).toHaveBeenCalledWith(expect.any(Object));
    expect(result).toBe("deleted");
  });
});