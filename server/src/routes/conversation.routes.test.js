import express from "express";
import request from "supertest";
import convoRoutes from "./conversation.routes.js";

jest.mock("../services/conversation.service.js", () => ({
  fetchConversations: jest.fn(),
  createConversation: jest.fn(),
}));

import {
  fetchConversations,
  createConversation,
} from "../services/conversation.service.js";

const app = express();
app.use(express.json());
app.use("/convo", convoRoutes);

describe("conversation.routes", () => {
  test("GET conversations", async () => {
    fetchConversations.mockResolvedValue([{ id: "c1" }]);

    const res = await request(app).get("/convo?userId=1");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("POST conversation", async () => {
    createConversation.mockResolvedValue({ id: "c1" });

    const res = await request(app)
      .post("/convo")
      .send({ userId: "1", title: "test" });

    expect(res.status).toBe(200);
  });

  test("handles error", async () => {
    fetchConversations.mockRejectedValue(new Error("fail"));

    const res = await request(app).get("/convo?userId=1");

    expect(res.status).toBe(500);
  });
});