import express from "express";
import request from "supertest";
import routes from "./index.js";

const app = express();
app.use(routes);

describe("routes index", () => {
  test("mounts routes without crashing", async () => {
    const res = await request(app).get("/");
    expect(res.status).not.toBe(500);
  });
});