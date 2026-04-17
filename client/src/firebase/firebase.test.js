// --- MOCKS ---

const mockInitializeApp = jest.fn();
const mockGetAnalytics = jest.fn();
const mockGetAuth = jest.fn();
const mockGetFirestore = jest.fn();

jest.mock("firebase/app", () => ({
  initializeApp: (...args) => mockInitializeApp(...args),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: (...args) => mockGetAnalytics(...args),
}));

jest.mock("firebase/auth", () => ({
  getAuth: (...args) => mockGetAuth(...args),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: (...args) => mockGetFirestore(...args),
}));

// --- TEST ---

describe("firebase config", () => {
  beforeEach(() => {
    jest.resetModules(); // important: re-runs module initialization

    process.env.REACT_APP_FIREBASE_API_KEY = "test-key";
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN = "test-domain";
    process.env.REACT_APP_FIREBASE_PROJECT_ID = "test-project";
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET = "test-bucket";
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "test-sender";
    process.env.REACT_APP_FIREBASE_APP_ID = "test-app";

    mockInitializeApp.mockReturnValue("app");
    mockGetAnalytics.mockReturnValue("analytics");
    mockGetAuth.mockReturnValue("auth");
    mockGetFirestore.mockReturnValue("db");
  });

  test("initializes firebase correctly and exports services", () => {
    const { app, auth, db } = require("./firebase");

    expect(mockInitializeApp).toHaveBeenCalledWith({
      apiKey: "test-key",
      authDomain: "test-domain",
      projectId: "test-project",
      storageBucket: "test-bucket",
      messagingSenderId: "test-sender",
      appId: "test-app",
    });

    expect(mockGetAnalytics).toHaveBeenCalledWith("app");
    expect(mockGetAuth).toHaveBeenCalledWith("app");
    expect(mockGetFirestore).toHaveBeenCalledWith("app");

    expect(app).toBe("app");
    expect(auth).toBe("auth");
    expect(db).toBe("db");
  });
});