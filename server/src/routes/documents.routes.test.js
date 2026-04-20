import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockUploadDocumentToInfra = jest.fn();

jest.unstable_mockModule("../services/documents.service.js", () => ({
  uploadDocumentToInfra: (...args) => mockUploadDocumentToInfra(...args),
}));

const { default: documentsRoutes } = await import("./documents.routes.js");

describe("documents.routes", () => {
  let app;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    app = express();
    app.use("/documents", documentsRoutes);
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  test("returns 400 when no file is uploaded", async () => {
    const res = await request(app).post("/documents/uploadDocument");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "No file uploaded" });
  });

  test("uploads document with parsed JSON metadata", async () => {
    mockUploadDocumentToInfra.mockResolvedValue({ id: "d1" });

    const res = await request(app)
      .post("/documents/uploadDocument")
      .field("metadata", JSON.stringify({ title: "Doc 1" }))
      .attach("file", Buffer.from("abc"), "test.txt");

    expect(res.status).toBe(200);
    expect(mockUploadDocumentToInfra).toHaveBeenCalled();
    expect(mockUploadDocumentToInfra.mock.calls[0][1]).toEqual({ title: "Doc 1" });
    expect(res.body).toEqual({
      message: "Document uploaded successfully",
      document: { id: "d1" },
    });
  });

  test("uploads document with raw metadata when JSON parsing fails", async () => {
    mockUploadDocumentToInfra.mockResolvedValue({ id: "d2" });

    const res = await request(app)
      .post("/documents/uploadDocument")
      .field("metadata", "raw-string")
      .attach("file", Buffer.from("abc"), "test.txt");

    expect(res.status).toBe(200);
    expect(mockUploadDocumentToInfra.mock.calls[0][1]).toBe("raw-string");
  });

  test("returns 500 with service error message", async () => {
    mockUploadDocumentToInfra.mockRejectedValue(new Error("upload exploded"));

    const res = await request(app)
      .post("/documents/uploadDocument")
      .attach("file", Buffer.from("abc"), "test.txt");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "upload exploded" });
  });
});