import express from "express";
import request from "supertest";
import chatRoutes from "./chat.routes.js";

jest.mock("../services/chat.service.js", () => ({
  uploadChatToBackend: jest.fn(),
}));

import { uploadChatToBackend } from "../services/chat.service.js";

const app = express();
app.use(express.json());
app.use("/chat", chatRoutes);

describe("chat.routes", () => {
  test("POST /chat returns response", async () => {
    uploadChatToBackend.mockResolvedValue({ answer: "hi" });

    const res = await request(app)
      .post("/chat")
      .send({ message: "hello" });

    expect(res.status).toBe(200);
    expect(res.body.answer).toBe("hi");
  });

  test("handles error", async () => {
    uploadChatToBackend.mockRejectedValue(new Error("fail"));

    const res = await request(app)
      .post("/chat")
      .send({ message: "hello" });

    expect(res.status).toBe(500);
  });
});