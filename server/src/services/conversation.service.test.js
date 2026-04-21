import { jest, describe, test, expect, beforeEach } from "@jest/globals";

const mockQuery = jest.fn();
const mockConnect = jest.fn();

jest.unstable_mockModule("../database/index.js", () => ({
  default: {
    query: (...args) => mockQuery(...args),
    connect: (...args) => mockConnect(...args),
  },
}));

const {
  createConversation,
  getConversationsByUser,
  createMessage,
  getMessagesByConversation,
  deleteConversation,
} = await import("./conversation.service.js");

describe("conversation.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createConversation inserts with provided title", async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: "c1", title: "My Chat" }] });

    const result = await createConversation("u1", "My Chat");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO conversations"),
      ["u1", "My Chat"]
    );
    expect(result).toEqual({ id: "c1", title: "My Chat" });
  });

  test("createConversation defaults title to New Chat", async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: "c1", title: "New Chat" }] });

    const result = await createConversation("u1");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO conversations"),
      ["u1", "New Chat"]
    );
    expect(result.title).toBe("New Chat");
  });

  test("getConversationsByUser returns rows", async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: "c1" }, { id: "c2" }] });

    const result = await getConversationsByUser("u1");

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("FROM conversations"),
      ["u1"]
    );
    expect(result).toEqual([{ id: "c1" }, { id: "c2" }]);
  });

  test("createMessage throws when conversation ownership check fails", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await expect(
      createMessage("c1", "u1", "user", "hello", [])
    ).rejects.toThrow("Unauthorized conversation access");
  });

  test("createMessage inserts message and updates conversation", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: "c1" }] })
      .mockResolvedValueOnce({ rows: [{ id: "m1", content: "hello" }] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await createMessage("c1", "u1", "assistant", "hello", [
      { source: "A" },
    ]);

    expect(result).toEqual({ id: "m1", content: "hello" });
  });

  test("getMessagesByConversation normalizes empty citations", async () => {
    mockQuery.mockResolvedValue({
      rows: [
        { id: "m1", citations: null, content: "a" },
        { id: "m2", citations: [{ source: "X" }], content: "b" },
      ],
    });

    const result = await getMessagesByConversation("c1", "u1");

    expect(result).toEqual([
      { id: "m1", citations: [], content: "a" },
      { id: "m2", citations: [{ source: "X" }], content: "b" },
    ]);
  });

  test("deleteConversation returns null when unauthorized and rolls back", async () => {
    const client = {
      query: jest.fn(),
      release: jest.fn(),
    };
    mockConnect.mockResolvedValue(client);
    client.query
      .mockResolvedValueOnce()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce();

    const result = await deleteConversation("c1", "u1");

    expect(result).toBeNull();
    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalled();
  });

  test("deleteConversation deletes messages and conversation, then commits", async () => {
    const client = {
      query: jest.fn(),
      release: jest.fn(),
    };
    mockConnect.mockResolvedValue(client);
    client.query
      .mockResolvedValueOnce()
      .mockResolvedValueOnce({ rows: [{ id: "c1" }] })
      .mockResolvedValueOnce()
      .mockResolvedValueOnce({ rows: [{ id: "c1", title: "gone" }] })
      .mockResolvedValueOnce();

    const result = await deleteConversation("c1", "u1");

    expect(client.query).toHaveBeenCalledWith("COMMIT");
    expect(client.release).toHaveBeenCalled();
    expect(result).toEqual({ id: "c1", title: "gone" });
  });

  test("deleteConversation rolls back and rethrows on error", async () => {
    const client = {
      query: jest.fn(),
      release: jest.fn(),
    };
    const err = new Error("db fail");
    mockConnect.mockResolvedValue(client);
    client.query
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(err)
      .mockResolvedValueOnce();

    await expect(deleteConversation("c1", "u1")).rejects.toThrow("db fail");
    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalled();
  });
});