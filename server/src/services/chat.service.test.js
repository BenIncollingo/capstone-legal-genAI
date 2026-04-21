import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { sendChatToInfra, sendWarmupToInfra } from "./chat.service.js";

describe("chat.service", () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.INFRA_BASE_URL = "https://infra.test";
    process.env.API_KEY = "secret";
    process.env.PROJECT_ID = "p1";
    process.env.SYSTEM_PROMPT = "prompt";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("sendChatToInfra sends chat to infra and returns parsed json", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: "hello" }),
    });

    const result = await sendChatToInfra("What is tort law?");

    expect(fetch).toHaveBeenCalledWith(
      "https://infra.test/api/v1/chat",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer secret",
        },
        body: JSON.stringify({
          question: "What is tort law?",
          project_id: "p1",
          min_score: 0.4,
          system_prompt: "prompt",
        }),
      })
    );
    expect(console.log).toHaveBeenCalledWith(
      "Calling infra URL:",
      "https://infra.test/api/v1/chat"
    );
    expect(console.log).toHaveBeenCalledWith("Infra response:", { answer: "hello" });
    expect(result).toEqual({ answer: "hello" });
  });

  test("sendChatToInfra throws when infra response is not ok", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => "down",
    });

    await expect(sendChatToInfra("x")).rejects.toThrow("Request failed: 503");

    expect(console.error).toHaveBeenCalledWith("Infra response status:", 503);
    expect(console.error).toHaveBeenCalledWith("Infra response body:", "down");
    expect(console.error).toHaveBeenCalledWith("Infra error:", expect.any(Error));
  });

  test("sendChatToInfra rethrows fetch errors", async () => {
    const err = new Error("network fail");
    fetch.mockRejectedValue(err);

    await expect(sendChatToInfra("x")).rejects.toThrow("network fail");
    expect(console.error).toHaveBeenCalledWith("Infra error:", err);
  });

  test("sendWarmupToInfra returns data on success", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ warmed: true }),
    });

    const result = await sendWarmupToInfra();

    expect(fetch).toHaveBeenCalledWith("https://infra.test/warmup", {
      method: "GET",
    });
    expect(console.log).toHaveBeenCalledWith(
      "Calling infra warmup URL:",
      "https://infra.test/warmup"
    );
    expect(console.log).toHaveBeenCalledWith("Warmup response:", { warmed: true });
    expect(result).toEqual({ warmed: true });
  });

  test("sendWarmupToInfra throws with status and details when response is not ok", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ detail: "cold start" }),
    });

    await expect(sendWarmupToInfra()).rejects.toMatchObject({
      message: "Warmup failed: 503",
      status: 503,
      details: { detail: "cold start" },
    });

    expect(console.error).toHaveBeenCalledWith("Warmup response status:", 503);
    expect(console.error).toHaveBeenCalledWith("Warmup response body:", {
      detail: "cold start",
    });
    expect(console.error).toHaveBeenCalledWith("Warmup error:", expect.any(Error));
  });

  test("sendWarmupToInfra rethrows fetch or json errors", async () => {
    const err = new Error("warmup boom");
    fetch.mockRejectedValue(err);

    await expect(sendWarmupToInfra()).rejects.toThrow("warmup boom");
    expect(console.error).toHaveBeenCalledWith("Warmup error:", err);
  });
});