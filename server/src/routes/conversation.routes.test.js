import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockCreateConversation = jest.fn();
const mockGetConversationsByUser = jest.fn();
const mockCreateMessage = jest.fn();
const mockGetMessagesByConversation = jest.fn();
const mockDeleteConversation = jest.fn();

jest.unstable_mockModule("../services/conversation.service.js", () => ({
  createConversation: (...args) => mockCreateConversation(...args),
  getConversationsByUser: (...args) => mockGetConversationsByUser(...args),
  createMessage: (...args) => mockCreateMessage(...args),
  getMessagesByConversation: (...args) => mockGetMessagesByConversation(...args),
  deleteConversation: (...args) => mockDeleteConversation(...args),
}));

const { default: conversationRoutes } = await import("./conversation.routes.js");

describe("conversation.routes", () => {
  let app;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    app = express();
    app.use(express.json());
    app.use("/db", conversationRoutes);
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  test("POST /db/conversations returns 400 without userId", async () => {
    const res = await request(app).post("/db/conversations").send({ title: "x" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "userId is required" });
  });

  test("POST /db/conversations creates conversation", async () => {
    mockCreateConversation.mockResolvedValue({ id: "c1" });

    const res = await request(app)
      .post("/db/conversations")
      .send({ userId: "u1", title: "t" });

    expect(res.status).toBe(201);
    expect(mockCreateConversation).toHaveBeenCalledWith("u1", "t");
    expect(res.body).toEqual({ id: "c1" });
  });

  test("POST /db/conversations handles service error", async () => {
    mockCreateConversation.mockRejectedValue(new Error("db fail"));

    const res = await request(app)
      .post("/db/conversations")
      .send({ userId: "u1", title: "t" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to create conversation" });
  });

  test("GET /db/conversations/:userId returns conversations", async () => {
    mockGetConversationsByUser.mockResolvedValue([{ id: "c1" }]);

    const res = await request(app).get("/db/conversations/u1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "c1" }]);
  });

  test("GET /db/conversations/:userId handles error", async () => {
    mockGetConversationsByUser.mockRejectedValue(new Error("db fail"));

    const res = await request(app).get("/db/conversations/u1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to fetch conversations" });
  });

  test("POST /db/messages returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/db/messages").send({ conversationId: "c1" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "conversationId, userId, role, and content are required",
    });
  });

  test("POST /db/messages creates message with default citations", async () => {
    mockCreateMessage.mockResolvedValue({ id: "m1" });

    const res = await request(app).post("/db/messages").send({
      conversationId: "c1",
      userId: "u1",
      role: "assistant",
      content: "hello",
    });

    expect(res.status).toBe(201);
    expect(mockCreateMessage).toHaveBeenCalledWith(
      "c1",
      "u1",
      "assistant",
      "hello",
      []
    );
    expect(res.body).toEqual({ id: "m1" });
  });

  test("POST /db/messages handles service error", async () => {
    mockCreateMessage.mockRejectedValue(new Error("db fail"));

    const res = await request(app).post("/db/messages").send({
      conversationId: "c1",
      userId: "u1",
      role: "assistant",
      content: "hello",
      citations: [{ source: "A" }],
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to create message" });
  });

  test("GET /db/messages/:conversationId/:userId returns messages", async () => {
    mockGetMessagesByConversation.mockResolvedValue([{ id: "m1" }]);

    const res = await request(app).get("/db/messages/c1/u1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: "m1" }]);
  });

  test("GET /db/messages/:conversationId/:userId handles error", async () => {
    mockGetMessagesByConversation.mockRejectedValue(new Error("db fail"));

    const res = await request(app).get("/db/messages/c1/u1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to fetch messages" });
  });

  test("DELETE /db/conversations/:conversationId/:userId returns 404 when not found", async () => {
    mockDeleteConversation.mockResolvedValue(null);

    const res = await request(app).delete("/db/conversations/c1/u1");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "Conversation not found or unauthorized",
    });
  });

  test("DELETE /db/conversations/:conversationId/:userId deletes conversation", async () => {
    mockDeleteConversation.mockResolvedValue({ id: "c1" });

    const res = await request(app).delete("/db/conversations/c1/u1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Conversation deleted successfully",
      conversation: { id: "c1" },
    });
  });

  test("DELETE /db/conversations/:conversationId/:userId handles error", async () => {
    mockDeleteConversation.mockRejectedValue(new Error("db fail"));

    const res = await request(app).delete("/db/conversations/c1/u1");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to delete conversation" });
  });
});