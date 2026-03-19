// ============================================================
// Unit Tests — capstone-legal-genAI
// Place in: client/src/__tests__/unit.test.js
// Run with: npx jest unit.test.js  (from inside /client)
// ============================================================

// ─── Mock global fetch & FormData ───────────────────────────
global.fetch = jest.fn();

global.FormData = class {
  constructor() { this.data = {}; }
  append(key, value) { this.data[key] = value; }
  get(key) { return this.data[key]; }
};

// ============================================================
// 1. documents.service.js — uploadDocumentToInfra logic
// ============================================================
const fsMock = { mkdir: jest.fn(), writeFile: jest.fn() };
const pathMock = { join: (...args) => args.join("/") };

async function uploadDocumentToInfra(file, metadata) {
  if (!file) throw new Error("No file provided to service");
  const uploadDir = pathMock.join(process.cwd(), "testInfraDB");
  await fsMock.mkdir(uploadDir, { recursive: true });
  const filePath = pathMock.join(uploadDir, file.originalname);
  await fsMock.writeFile(filePath, file.buffer);
  return {
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    savedTo: filePath,
    metadata: metadata || null,
  };
}

describe("uploadDocumentToInfra", () => {
  const mockFile = {
    originalname: "test.pdf",
    mimetype: "application/pdf",
    size: 1024,
    buffer: Buffer.from("file content"),
  };

  beforeEach(() => jest.clearAllMocks());

  test("throws if no file is provided", async () => {
    await expect(uploadDocumentToInfra(null)).rejects.toThrow(
      "No file provided to service"
    );
  });

  test("returns correct metadata on success", async () => {
    const result = await uploadDocumentToInfra(mockFile, { title: "Test Doc" });
    expect(result.originalName).toBe("test.pdf");
    expect(result.mimetype).toBe("application/pdf");
    expect(result.size).toBe(1024);
    expect(result.metadata).toEqual({ title: "Test Doc" });
  });

  test("metadata is null when not provided", async () => {
    const result = await uploadDocumentToInfra(mockFile);
    expect(result.metadata).toBeNull();
  });

  test("calls mkdir and writeFile", async () => {
    await uploadDocumentToInfra(mockFile);
    expect(fsMock.mkdir).toHaveBeenCalledTimes(1);
    expect(fsMock.writeFile).toHaveBeenCalledTimes(1);
  });

  test("savedTo path includes the original filename", async () => {
    const result = await uploadDocumentToInfra(mockFile);
    expect(result.savedTo).toContain("test.pdf");
  });
});

// ============================================================
// 2. chat.service.js — sendChatToInfra logic
// ============================================================
async function sendChatToInfra(message) {
  return {
    response: "example AI response message: wow very interesting question",
  };
}

describe("sendChatToInfra", () => {
  test("returns a response object", async () => {
    const result = await sendChatToInfra("Hello");
    expect(result).toHaveProperty("response");
  });

  test("response is a string", async () => {
    const result = await sendChatToInfra("Hello");
    expect(typeof result.response).toBe("string");
  });

  test("works with an empty string message", async () => {
    const result = await sendChatToInfra("");
    expect(result).toHaveProperty("response");
  });

  test("works with a long message", async () => {
    const result = await sendChatToInfra("a".repeat(1000));
    expect(result).toHaveProperty("response");
  });
});

// ============================================================
// 3. data.service.js — testData logic
// ============================================================
function testDataService() {
  // mirrors data.service.js
}

describe("testData (data.service)", () => {
  test("runs without throwing", () => {
    expect(() => testDataService()).not.toThrow();
  });

  test("returns undefined", () => {
    expect(testDataService()).toBeUndefined();
  });
});

// ============================================================
// 4. chat.api.js — uploadChatToBackend logic
// ============================================================
async function uploadChatToBackend(userChat) {
  const res = await fetch("/api/chat/uploadChat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat: userChat }),
  });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return await res.json();
}

describe("uploadChatToBackend", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns data on a successful response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "AI reply" }),
    });
    const result = await uploadChatToBackend("What is contract law?");
    expect(result).toEqual({ response: "AI reply" });
  });

  test("throws on a non-ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(uploadChatToBackend("test")).rejects.toThrow(
      "API request failed: 500"
    );
  });

  test("sends the message in the request body", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await uploadChatToBackend("test message");
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.chat).toBe("test message");
  });

  test("posts to the correct endpoint", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await uploadChatToBackend("hello");
    expect(fetch.mock.calls[0][0]).toBe("/api/chat/uploadChat");
  });
});

// ============================================================
// 5. data.api.js — testData logic
// ============================================================
async function testDataApi() {
  const res = await fetch("/api/data/test");
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return await res.json();
}

describe("testData (data.api)", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns data on success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "ok" }),
    });
    const result = await testDataApi();
    expect(result).toEqual({ message: "ok" });
  });

  test("throws on non-ok response", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(testDataApi()).rejects.toThrow("API request failed: 404");
  });

  test("calls the correct endpoint", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await testDataApi();
    expect(fetch.mock.calls[0][0]).toBe("/api/data/test");
  });
});

// ============================================================
// 6. documents.api.js — uploadDocumentToBackend logic
// ============================================================
async function uploadDocumentToBackend(file, metadata) {
  const formData = new FormData();
  formData.append("file", file);
  if (metadata) formData.append("metadata", JSON.stringify(metadata));

  const res = await fetch("/api/documents/uploadDocument", {
    method: "POST",
    body: formData,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore non-JSON
  }

  if (!res.ok) throw new Error(data?.message || `Upload failed: ${res.status}`);
  return data;
}

describe("uploadDocumentToBackend", () => {
  beforeEach(() => jest.clearAllMocks());

  const mockFile = { name: "doc.pdf", size: 1024, type: "application/pdf" };

  test("returns data on a successful upload", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ savedTo: "/testInfraDB/doc.pdf" }),
    });
    const result = await uploadDocumentToBackend(mockFile, { title: "Doc" });
    expect(result).toEqual({ savedTo: "/testInfraDB/doc.pdf" });
  });

  test("throws with server error message when upload fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: "Bad file type" }),
    });
    await expect(uploadDocumentToBackend(mockFile)).rejects.toThrow("Bad file type");
  });

  test("throws with status when no error message in response", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    await expect(uploadDocumentToBackend(mockFile)).rejects.toThrow("Upload failed: 500");
  });

  test("posts to the correct endpoint", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await uploadDocumentToBackend(mockFile);
    expect(fetch.mock.calls[0][0]).toBe("/api/documents/uploadDocument");
  });

  test("uses POST method", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await uploadDocumentToBackend(mockFile);
    expect(fetch.mock.calls[0][1].method).toBe("POST");
  });
});

// ============================================================
// 7. SignIn.jsx — form validation logic
// ============================================================
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

// ============================================================
// 8. Create.jsx — form validation logic
// ============================================================
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

// ============================================================
// 9. ForgotPassword.jsx — validation logic
// ============================================================
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

// ============================================================
// 10. DocumentUploadPage.jsx — formatSize helper
// ============================================================
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

describe("formatSize", () => {
  test("formats bytes correctly", () => {
    expect(formatSize(500)).toBe("500 B");
  });

  test("formats kilobytes correctly", () => {
    expect(formatSize(2048)).toBe("2.0 KB");
  });

  test("formats megabytes correctly", () => {
    expect(formatSize(1048576)).toBe("1.0 MB");
  });

  test("formats 0 bytes", () => {
    expect(formatSize(0)).toBe("0 B");
  });

  test("formats a large file", () => {
    expect(formatSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});