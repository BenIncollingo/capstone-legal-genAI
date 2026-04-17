import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LawGPT from "./LawGPT";

const mockNavigate = jest.fn();

const mockFetchConversations = jest.fn();
const mockCreateConversation = jest.fn();
const mockFetchMessages = jest.fn();
const mockCreateMessage = jest.fn();
const mockUploadChatToBackend = jest.fn();
const mockDeleteConversation = jest.fn();
const mockDoSignOut = jest.fn();

let mockCurrentUser = { uid: "user-1", email: "user@test.com" };

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../contexts/authContext/index.jsx", () => ({
  useAuth: () => ({
    currentUser: mockCurrentUser,
  }),
}));

jest.mock("../api/chat.api.js", () => ({
  uploadChatToBackend: (...args) => mockUploadChatToBackend(...args),
  fetchConversations: (...args) => mockFetchConversations(...args),
  createConversation: (...args) => mockCreateConversation(...args),
  fetchMessages: (...args) => mockFetchMessages(...args),
  createMessage: (...args) => mockCreateMessage(...args),
  deleteConversation: (...args) => mockDeleteConversation(...args),
}));

jest.mock("../firebase/auth.js", () => ({
  doSignOut: (...args) => mockDoSignOut(...args),
}));

jest.mock("../components/LawGPT/LawGPTSidebar.jsx", () => {
  return function MockSidebar(props) {
    return (
      <div>
        <div data-testid="sidebar-open">{String(props.sidebarOpen)}</div>
        <div data-testid="settings-open">{String(props.settingsOpen)}</div>
        <div data-testid="conversation-count">{props.conversations.length}</div>
        <button onClick={props.handleNewChat}>new chat</button>
        <button onClick={() => props.loadConversationMessages("c2", 1)}>
          load conversation
        </button>
        <button onClick={props.handleLogout}>logout</button>
        <button onClick={props.onOpenSettings}>open settings</button>
        <button onClick={() => props.setSettingsOpen(true)}>open settings menu</button>
        <button onClick={() => props.handleDeleteConversation("c1")}>
          delete c1
        </button>
      </div>
    );
  };
});

jest.mock("../components/LawGPT/LawGPTHeader.jsx", () => {
  return function MockHeader(props) {
    return (
      <div>
        <div data-testid="active-title">{props.activeConversation.title}</div>
        <div data-testid="selected-id">{String(props.selectedConversationId)}</div>
        <button onClick={() => props.setSidebarOpen(true)}>open sidebar</button>
      </div>
    );
  };
});

jest.mock("../components/LawGPT/LawGPTMessageList.jsx", () => {
  return function MockMessageList(props) {
    return (
      <div>
        <div data-testid="is-sending">{String(props.isSending)}</div>
        {props.messages.map((msg, idx) => (
          <div key={idx}>
            <span>{msg.role}:</span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("../components/LawGPT/LawGPTChatInput.jsx", () => {
  return function MockChatInput(props) {
    return (
      <div>
        <input
          aria-label="chat-input"
          value={props.message}
          onChange={(e) => props.setMessage(e.target.value)}
        />
        <button onClick={props.onSend}>send</button>
      </div>
    );
  };
});

describe("LawGPT", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = { uid: "user-1", email: "user@test.com" };

    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    mockFetchConversations.mockResolvedValue([]);
    mockFetchMessages.mockResolvedValue([]);
    mockCreateConversation.mockResolvedValue({ id: "new-c1", title: "New Chat" });
    mockCreateMessage.mockResolvedValue({});
    mockUploadChatToBackend.mockResolvedValue({
      answer: "assistant reply",
      citations: [],
    });
    mockDeleteConversation.mockResolvedValue({});
    mockDoSignOut.mockResolvedValue({});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.log.mockRestore();
    window.confirm.mockRestore();
  });

  test("shows empty state when the user has no conversations", async () => {
    render(<LawGPT />);

    expect(await screen.findByText(/legalai assistant/i)).toBeInTheDocument();
    expect(mockFetchConversations).toHaveBeenCalledWith("user-1");
    expect(screen.getByTestId("selected-id")).toHaveTextContent("null");
  });

  test("loads existing conversations and first conversation messages", async () => {
    mockFetchConversations.mockResolvedValue([
      { id: "c1", title: "First Chat" },
      { id: "c2", title: "Second Chat" },
    ]);
    mockFetchMessages.mockResolvedValue([
      { role: "user", content: "hello", citations: undefined },
      { role: "assistant", content: "world", citations: [{ source: "A" }] },
    ]);

    render(<LawGPT />);

    expect(await screen.findByText("user:")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();
    expect(screen.getByTestId("active-title")).toHaveTextContent("First Chat");
    expect(screen.getByTestId("selected-id")).toHaveTextContent("c1");
  });

  test("logs when loading conversations fails", async () => {
    mockFetchConversations.mockRejectedValue(new Error("load failed"));

    render(<LawGPT />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to load conversations:",
        expect.any(Error)
      );
    });
  });

  test("removes the mousedown listener on unmount", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const removeSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = render(<LawGPT />);
    const handler = addSpy.mock.calls.find(([type]) => type === "mousedown")[1];

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousedown", handler);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  test("logout success signs out and navigates", async () => {
    render(<LawGPT />);

    fireEvent.click(screen.getByText("logout"));

    await waitFor(() => {
      expect(mockDoSignOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("logout failure logs and does not navigate", async () => {
    mockDoSignOut.mockRejectedValue(new Error("bad logout"));

    render(<LawGPT />);

    fireEvent.click(screen.getByText("logout"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Logout failed:",
        expect.any(Error)
      );
    });

    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
  });

  test("open settings closes the menu state and navigates", async () => {
    render(<LawGPT />);

    fireEvent.click(screen.getByText("open settings"));

    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });

  test("loads selected conversation messages and closes sidebar", async () => {
    mockFetchConversations.mockResolvedValue([
      { id: "c1", title: "First Chat" },
      { id: "c2", title: "Second Chat" },
    ]);
    mockFetchMessages
      .mockResolvedValueOnce([{ role: "assistant", content: "initial", citations: [] }])
      .mockResolvedValueOnce([{ role: "assistant", content: "loaded c2", citations: [] }]);

    render(<LawGPT />);

    expect(await screen.findByText("initial")).toBeInTheDocument();

    fireEvent.click(screen.getByText("load conversation"));

    await waitFor(() => {
      expect(mockFetchMessages).toHaveBeenLastCalledWith("c2", "user-1");
    });

    expect(screen.getByText("loaded c2")).toBeInTheDocument();
    expect(screen.getByTestId("selected-id")).toHaveTextContent("c2");
  });

  test("does nothing when loadConversationMessages is called without a user id", async () => {
    mockCurrentUser = null;

    render(<LawGPT />);

    fireEvent.click(screen.getByText("load conversation"));

    expect(mockFetchMessages).not.toHaveBeenCalled();
  });

  test("logs when loading selected conversation messages fails", async () => {
    mockFetchConversations.mockResolvedValue([
      { id: "c1", title: "First Chat" },
    ]);
    mockFetchMessages
      .mockResolvedValueOnce([{ role: "assistant", content: "initial", citations: [] }])
      .mockRejectedValueOnce(new Error("message load failed"));

    render(<LawGPT />);

    expect(await screen.findByText("initial")).toBeInTheDocument();

    fireEvent.click(screen.getByText("load conversation"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to load messages:",
        expect.any(Error)
      );
    });
  });

  test("new chat clears the selected conversation and messages", async () => {
    mockFetchConversations.mockResolvedValue([{ id: "c1", title: "First Chat" }]);
    mockFetchMessages.mockResolvedValue([
      { role: "assistant", content: "existing message", citations: [] },
    ]);

    render(<LawGPT />);

    expect(await screen.findByText("existing message")).toBeInTheDocument();

    fireEvent.click(screen.getByText("new chat"));

    expect(screen.queryByText("existing message")).not.toBeInTheDocument();
    expect(screen.getByText(/legalai assistant/i)).toBeInTheDocument();
    expect(screen.getByTestId("selected-id")).toHaveTextContent("null");
  });

  test("delete conversation returns early when confirm is false", async () => {
    window.confirm.mockImplementation(() => false);

    render(<LawGPT />);

    fireEvent.click(screen.getByText("delete c1"));

    expect(mockDeleteConversation).not.toHaveBeenCalled();
  });

  test("delete conversation removes the active conversation and clears messages", async () => {
    mockFetchConversations.mockResolvedValue([
      { id: "c1", title: "First Chat" },
      { id: "c2", title: "Second Chat" },
    ]);
    mockFetchMessages.mockResolvedValue([
      { role: "assistant", content: "active message", citations: [] },
    ]);

    render(<LawGPT />);

    expect(await screen.findByText("active message")).toBeInTheDocument();

    fireEvent.click(screen.getByText("delete c1"));

    await waitFor(() => {
      expect(mockDeleteConversation).toHaveBeenCalledWith("c1", "user-1");
    });

    expect(screen.queryByText("active message")).not.toBeInTheDocument();
    expect(screen.getByText(/legalai assistant/i)).toBeInTheDocument();
  });

  test("logs when delete conversation fails", async () => {
    mockDeleteConversation.mockRejectedValue(new Error("delete failed"));

    render(<LawGPT />);

    fireEvent.click(screen.getByText("delete c1"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting conversation:",
        expect.any(Error)
      );
    });
  });

  test("onSend returns early for blank input", async () => {
    render(<LawGPT />);

    fireEvent.change(screen.getByLabelText("chat-input"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByText("send"));

    expect(mockCreateConversation).not.toHaveBeenCalled();
    expect(mockUploadChatToBackend).not.toHaveBeenCalled();
  });

  test("onSend returns early when there is no user id", async () => {
    mockCurrentUser = null;

    render(<LawGPT />);

    fireEvent.change(screen.getByLabelText("chat-input"), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByText("send"));

    expect(mockCreateConversation).not.toHaveBeenCalled();
    expect(mockUploadChatToBackend).not.toHaveBeenCalled();
  });

  test("creates a new conversation with a truncated title for long messages", async () => {
    mockFetchConversations
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: "new-c1", title: "Refreshed Title" }]);

    mockCreateConversation.mockResolvedValue({ id: "new-c1", title: "Refreshed Title" });
    mockUploadChatToBackend.mockResolvedValue({ response: "reply from response key" });

    render(<LawGPT />);

    fireEvent.change(screen.getByLabelText("chat-input"), {
      target: {
        value: "abcdefghijklmnopqrstuvwxyz1234567890",
      },
    });
    fireEvent.click(screen.getByText("send"));

    await waitFor(() => {
      expect(mockCreateConversation).toHaveBeenCalledWith(
        "user-1",
        "abcdefghijklmnopqrstuvwxyz1234..."
      );
    });

    await waitFor(() => {
      expect(mockCreateMessage).toHaveBeenCalledWith(
        "new-c1",
        "user-1",
        "assistant",
        "reply from response key",
        []
      );
    });

    expect(screen.getByText("reply from response key")).toBeInTheDocument();
  });

  test("uses fallback response text when backend returns no answer or response", async () => {
    mockFetchConversations
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: "new-c1", title: "Chat" }]);

    mockCreateConversation.mockResolvedValue({ id: "new-c1", title: "Chat" });
    mockUploadChatToBackend.mockResolvedValue({ citations: "not-an-array" });

    render(<LawGPT />);

    fireEvent.change(screen.getByLabelText("chat-input"), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByText("send"));

    expect(await screen.findByText("No response returned.")).toBeInTheDocument();
  });

  test("sends on an existing conversation without creating a new one", async () => {
    mockFetchConversations.mockResolvedValue([{ id: "c1", title: "First Chat" }]);
    mockFetchMessages.mockResolvedValue([
      { role: "assistant", content: "initial", citations: [] },
    ]);

    render(<LawGPT />);

    expect(await screen.findByText("initial")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("chat-input"), {
      target: { value: "follow up" },
    });
    fireEvent.click(screen.getByText("send"));

    await waitFor(() => {
      expect(mockCreateConversation).not.toHaveBeenCalled();
    });

    expect(mockCreateMessage).toHaveBeenCalledWith("c1", "user-1", "user", "follow up");
  });

  test("adds fallback assistant message when upload fails and saves it", async () => {
    mockFetchConversations.mockResolvedValue([{ id: "c1", title: "First Chat" }]);
    mockFetchMessages.mockResolvedValue([]);
    mockUploadChatToBackend.mockRejectedValue(new Error("boom"));

    render(<LawGPT />);

    fireEvent.change(screen.getByLabelText("chat-input"), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByText("send"));

    expect(
      await screen.findByText("Something went wrong getting a response.")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockCreateMessage).toHaveBeenCalledWith(
        "c1",
        "user-1",
        "assistant",
        "Something went wrong getting a response.",
        []
      );
    });
  });

  test("logs when saving the fallback assistant message also fails", async () => {
    mockFetchConversations.mockResolvedValue([{ id: "c1", title: "First Chat" }]);
    mockFetchMessages.mockResolvedValue([]);
    mockUploadChatToBackend.mockRejectedValue(new Error("boom"));
    mockCreateMessage
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("save failed"));

    render(<LawGPT />);

    fireEvent.change(screen.getByLabelText("chat-input"), {
      target: { value: "hello" },
    });
    fireEvent.click(screen.getByText("send"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to save fallback assistant message:",
        expect.any(Error)
      );
    });
  });

  test("shows and closes the sidebar overlay", async () => {
    render(<LawGPT />);

    fireEvent.click(screen.getByText("open sidebar"));

    const overlay = screen.getByLabelText("Close sidebar overlay");
    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay);

    await waitFor(() => {
      expect(screen.queryByLabelText("Close sidebar overlay")).not.toBeInTheDocument();
    });
  });
});