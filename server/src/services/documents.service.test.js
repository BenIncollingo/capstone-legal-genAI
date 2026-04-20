import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { uploadDocumentToInfra } from "./documents.service.js";

describe("documents.service", () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.INFRA_BASE_URL = "https://infra.test";
    process.env.PROJECT_ID = "p1";
    process.env.API_KEY = "secret";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("throws when no file is provided", async () => {
    await expect(uploadDocumentToInfra()).rejects.toThrow("No file provided");
  });

  test("uploads file to infra and returns json", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ stored: true }),
    });

    const file = {
      buffer: Buffer.from("abc"),
      mimetype: "text/plain",
      originalname: "notes.txt",
    };

    const result = await uploadDocumentToInfra(file, { title: "notes" });

    expect(fetch).toHaveBeenCalledWith(
      "https://infra.test/ingest/p1/upload",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer secret",
        },
        body: expect.any(FormData),
      })
    );
    expect(result).toEqual({ stored: true });
  });

  test("throws formatted error when infra response is not ok", async () => {
    fetch.mockResolvedValue({
      ok: false,
      text: async () => "bad upload",
    });

    const file = {
      buffer: Buffer.from("abc"),
      mimetype: "text/plain",
      originalname: "notes.txt",
    };

    await expect(uploadDocumentToInfra(file)).rejects.toThrow(
      "Infra upload failed: bad upload"
    );

    expect(console.error).toHaveBeenCalledWith(
      "Error: Infra upload failed: bad upload"
    );
  });

  test("rethrows fetch errors", async () => {
    const err = new Error("network fail");
    fetch.mockRejectedValue(err);

    const file = {
      buffer: Buffer.from("abc"),
      mimetype: "text/plain",
      originalname: "notes.txt",
    };

    await expect(uploadDocumentToInfra(file)).rejects.toThrow("network fail");
    expect(console.error).toHaveBeenCalledWith("Error: network fail");
  });
});