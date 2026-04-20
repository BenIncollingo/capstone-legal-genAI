import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockQuery = jest.fn();

jest.unstable_mockModule("../database/index.js", () => ({
  default: {
    query: (...args) => mockQuery(...args),
  },
}));

const { default: router } = await import("./index.js");

describe("routes/index", () => {
  let app;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    app = express();
    app.use(express.json());
    app.use(router);
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  test("GET /test-db returns success and time row", async () => {
    mockQuery.mockResolvedValue({ rows: [{ now: "time" }] });

    const res = await request(app).get("/test-db");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      time: { now: "time" },
    });
  });

  test("GET /test-db handles db failure", async () => {
    mockQuery.mockRejectedValue(new Error("db fail"));

    const res = await request(app).get("/test-db");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      error: "db fail",
    });
  });
});