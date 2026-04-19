import * as chatService from "./chat.service.js";

describe("chat.service", () => {
  test("returns response when API succeeds", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      json: async () => ({ answer: "hello" }),
    });

    global.fetch = mockFetch;

    const res = await chatService.uploadChatToBackend("hi");

    expect(mockFetch).toHaveBeenCalled();
    expect(res).toEqual({ answer: "hello" });
  });

  test("handles fetch failure", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("fail"));

    await expect(
      chatService.uploadChatToBackend("hi")
    ).rejects.toThrow("fail");
  });
});