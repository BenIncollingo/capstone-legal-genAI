import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockSendChatToInfra = jest.fn();
const mockSendWarmupToInfra = jest.fn();

jest.unstable_mockModule("../services/chat.service.js", () => ({
  sendChatToInfra: (...args) => mockSendChatToInfra(...args),
  sendWarmupToInfra: (...args) => mockSendWarmupToInfra(...args),
}));

const { default: chatRoutes } = await import("./chat.routes.js");

describe("chat.routes", () => {
  let app;
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    app = express();
    app.use(express.json());
    app.use("/chat", chatRoutes);
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("POST /chat/uploadChat sends chat to infra and returns json", async () => {
    mockSendChatToInfra.mockResolvedValue({ answer: "hello" });

    const res = await request(app)
      .post("/chat/uploadChat")
      .send({ chat: "hi there" });

    expect(res.status).toBe(200);
    expect(console.log).toHaveBeenCalledWith(
      "route hit: /api/chat/uploadChat with req: hi there"
    );
    expect(mockSendChatToInfra).toHaveBeenCalledWith("hi there");
    expect(res.body).toEqual({ answer: "hello" });
  });

  test("GET /chat/warmup returns 200 and infra response on success", async () => {
    mockSendWarmupToInfra.mockResolvedValue({ warmed: true });

    const res = await request(app).get("/chat/warmup");

    expect(res.status).toBe(200);
    expect(console.log).toHaveBeenCalledWith("route hit: /api/chat/warmup");
    expect(mockSendWarmupToInfra).toHaveBeenCalled();
    expect(res.body).toEqual({ warmed: true });
  });

  test("GET /chat/warmup preserves error status and details when provided", async () => {
    const err = new Error("Infra unavailable");
    err.status = 503;
    err.details = { upstream: "cold" };
    mockSendWarmupToInfra.mockRejectedValue(err);

    const res = await request(app).get("/chat/warmup");

    expect(res.status).toBe(503);
    expect(console.error).toHaveBeenCalledWith("warmup route error:", err);
    expect(res.body).toEqual({
      error: "Infra unavailable",
      details: { upstream: "cold" },
    });
  });

  test("GET /chat/warmup falls back to 500 and null details", async () => {
    const err = new Error("boom");
    mockSendWarmupToInfra.mockRejectedValue(err);

    const res = await request(app).get("/chat/warmup");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "boom",
      details: null,
    });
  });
});