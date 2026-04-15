// ============================================================
// API Unit Tests — capstone-legal-genAI
// Place in: client/src/__tests__/api.test.js
// Run with: npm test -- --coverage --watchAll=false --testPathPattern="api.test.js"
// ============================================================

import { uploadChatToBackend } from "../api/chat.api";
import { testData as testDataApi } from "../api/data.api";
import { uploadDocumentToBackend } from "../api/documents.api";

global.fetch = jest.fn();

global.FormData = class {
  constructor() { this.data = {}; }
  append(key, value) { this.data[key] = value; }
  get(key) { return this.data[key]; }
};

// ============================================================
// 1. chat.api.js
// ============================================================
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
    await expect(uploadChatToBackend("test")).rejects.toThrow("API request failed: 500");
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
// 2. data.api.js
// ============================================================
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
// 3. documents.api.js
// ============================================================
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