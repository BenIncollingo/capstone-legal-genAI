import { uploadDocumentToBackend } from "./documents.api";

global.fetch = jest.fn();

describe("documents.api", () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test("uploads a document with metadata and returns json", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const file = new File(["hello"], "test.txt", { type: "text/plain" });
    const result = await uploadDocumentToBackend(file, { title: "test" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/documents/uploadDocument"),
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );
    expect(result).toEqual({ success: true });
  });

  test("uploads a document without metadata", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: 1 }),
    });

    const file = new File(["hello"], "plain.txt", { type: "text/plain" });
    const result = await uploadDocumentToBackend(file);

    expect(result).toEqual({ ok: 1 });
  });

  test("throws backend json message on failure", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: "Bad upload" }),
    });

    const file = new File(["hello"], "bad.txt", { type: "text/plain" });

    await expect(uploadDocumentToBackend(file, {})).rejects.toThrow("Bad upload");
  });

  test("throws fallback message when response is not valid json", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => {
        throw new Error("invalid json");
      },
    });

    const file = new File(["hello"], "bad.txt", { type: "text/plain" });

    await expect(uploadDocumentToBackend(file, {})).rejects.toThrow(
      "Upload failed: 503"
    );
  });
});