import * as convoService from "./conversation.service.js";

describe("conversation.service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("fetches conversations", async () => {
    fetch.mockResolvedValue({
      json: async () => [{ id: "c1" }],
    });

    const res = await convoService.fetchConversations("user1");

    expect(res).toEqual([{ id: "c1" }]);
  });

  test("creates conversation", async () => {
    fetch.mockResolvedValue({
      json: async () => ({ id: "c1" }),
    });

    const res = await convoService.createConversation("user1", "title");

    expect(res.id).toBe("c1");
  });

  test("handles failure", async () => {
    fetch.mockRejectedValue(new Error("fail"));

    await expect(
      convoService.fetchConversations("user1")
    ).rejects.toThrow("fail");
  });
});