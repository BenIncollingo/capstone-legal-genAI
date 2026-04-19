import express from "express";
import request from "supertest";
import docRoutes from "./documents.routes.js";

jest.mock("../services/documents.service.js", () => ({
  uploadDocumentToBackend: jest.fn(),
}));

import { uploadDocumentToBackend } from "../services/documents.service.js";

const app = express();
app.use(express.json());
app.use("/docs", docRoutes);

describe("documents.routes", () => {
  test("uploads document", async () => {
    uploadDocumentToBackend.mockResolvedValue({ ok: true });

    const res = await request(app)
      .post("/docs")
      .send({ title: "test" });

    expect(res.status).toBe(200);
  });

  test("handles failure", async () => {
    uploadDocumentToBackend.mockRejectedValue(new Error("fail"));

    const res = await request(app)
      .post("/docs")
      .send({});

    expect(res.status).toBe(500);
  });
});