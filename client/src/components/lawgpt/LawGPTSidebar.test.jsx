import { render, screen, fireEvent } from "@testing-library/react";
import LawGPTSidebar from "./LawGPTSidebar";

describe("LawGPTSidebar", () => {
  const baseProps = {
    sidebarOpen: true,
    handleNewChat: jest.fn(),
    conversations: [
      {
        id: "c1",
        title: "First Chat",
        updated_at: "2025-01-01T00:00:00.000Z",
      },
    ],
    activeIdx: 0,
    loadConversationMessages: jest.fn(),
    currentUser: { email: "user@example.com" },
    settingsRef: { current: null },
    settingsOpen: false,
    setSettingsOpen: jest.fn(),
    handleLogout: jest.fn(),
    isLoggingOut: false,
    onOpenSettings: jest.fn(),
    handleDeleteConversation: jest.fn(),
  };

  beforeEach(() => {
    Object.values(baseProps).forEach((v) => {
      if (typeof v === "function" && v.mockReset) v.mockReset();
    });
  });

  test("starts a new chat and loads conversation", () => {
    render(<LawGPTSidebar {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: /new chat/i }));
    expect(baseProps.handleNewChat).toHaveBeenCalled();

    fireEvent.click(screen.getAllByText("First Chat")[0]);
    expect(baseProps.loadConversationMessages).toHaveBeenCalledWith("c1", 0);
  });

  test("deletes conversation", () => {
    render(<LawGPTSidebar {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: /delete first chat/i }));
    expect(baseProps.handleDeleteConversation).toHaveBeenCalledWith("c1");
  });

  test("toggles settings menu", () => {
    render(<LawGPTSidebar {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: /^settings$/i }));
    expect(baseProps.setSettingsOpen).toHaveBeenCalled();
  });

  test("shows settings actions when menu is open", () => {
    render(<LawGPTSidebar {...baseProps} settingsOpen={true} />);

    fireEvent.click(screen.getByRole("button", { name: /log out/i }));
    expect(baseProps.handleLogout).toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole("button", { name: /settings/i })[1]);
    expect(baseProps.onOpenSettings).toHaveBeenCalled();
  });

  test("renders without timestamp when updated_at is missing", () => {
    render(
      <LawGPTSidebar
        {...baseProps}
        activeIdx={-1}
        conversations={[{ id: "c2", title: "No Timestamp Chat" }]}
        currentUser={null}
      />
    );

    expect(screen.getByText("No Timestamp Chat")).toBeInTheDocument();
    expect(screen.getByText("Not logged in")).toBeInTheDocument();

    const convoButton = screen.getByRole("button", { name: /no timestamp chat/i });
    expect(convoButton).toBeInTheDocument();
  });

  test("shows logging out text when logout is in progress", () => {
    render(<LawGPTSidebar {...baseProps} settingsOpen={true} isLoggingOut={true} />);

    expect(screen.getByRole("button", { name: /logging out/i })).toBeDisabled();
  });
});