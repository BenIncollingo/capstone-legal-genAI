import {
  uploadChatToBackend,
  fetchConversations,
  createConversation,
  fetchMessages,
  createMessage,
  deleteConversation,
} from "./chat.api";

global.fetch = jest.fn();

describe("chat.api", () => {
  beforeEach(() => {
    fetch.mockReset();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test("uploadChatToBackend posts chat and returns data", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ answer: "hello" }),
    });

    const result = await uploadChatToBackend("question");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/chat/uploadChat"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
    expect(result).toEqual({ answer: "hello" });
  });

  test("uploadChatToBackend throws on failed response", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(uploadChatToBackend("question")).rejects.toThrow(
      "API request failed: 500"
    );
  });

  test("fetchConversations returns json", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    const result = await fetchConversations("u1");
    expect(result).toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/db/conversations/u1"));
  });

  test("fetchConversations throws on failure", async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(fetchConversations("u1")).rejects.toThrow(
      "Failed to fetch conversations"
    );
  });

  test("createConversation uses default title", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "c1", title: "New Chat" }),
    });

    const result = await createConversation("u1");
    expect(result).toEqual({ id: "c1", title: "New Chat" });

    const [, options] = fetch.mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({ userId: "u1", title: "New Chat" });
  });

  test("createConversation throws on failure", async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(createConversation("u1", "Custom")).rejects.toThrow(
      "Failed to create conversation"
    );
  });

  test("fetchMessages returns messages", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ role: "user", content: "hi" }],
    });

    const result = await fetchMessages("c1", "u1");
    expect(result).toEqual([{ role: "user", content: "hi" }]);
  });

  test("fetchMessages throws on failure", async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(fetchMessages("c1", "u1")).rejects.toThrow(
      "Failed to fetch messages"
    );
  });

  test("createMessage posts all fields including citations", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ saved: true }),
    });

    const citations = [{ source: "A" }];
    const result = await createMessage("c1", "u1", "assistant", "hello", citations);

    expect(result).toEqual({ saved: true });
    const [, options] = fetch.mock.calls[0];
    expect(JSON.parse(options.body)).toEqual({
      conversationId: "c1",
      userId: "u1",
      role: "assistant",
      content: "hello",
      citations,
    });
  });

  test("createMessage throws on failure", async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(createMessage("c1", "u1", "user", "x")).rejects.toThrow(
      "Failed to create message"
    );
  });

  test("deleteConversation sends delete request", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ deleted: true }),
    });

    const result = await deleteConversation("c1", "u1");
    expect(result).toEqual({ deleted: true });

    const [, options] = fetch.mock.calls[0];
    expect(options.method).toBe("DELETE");
  });

  test("deleteConversation throws on failure", async () => {
    fetch.mockResolvedValue({ ok: false });

    await expect(deleteConversation("c1", "u1")).rejects.toThrow(
      "Failed to delete conversation"
    );
  });
});