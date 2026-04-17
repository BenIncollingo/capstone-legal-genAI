import { render, screen } from "@testing-library/react";
import LawGPTMessageList from "./LawGPTMessageList";

describe("LawGPTMessageList", () => {
  test("renders user and assistant messages, accuracy, and unique sources", () => {
    render(
      <LawGPTMessageList
        isSending={false}
        messages={[
          { role: "user", text: "My question", citations: [] },
          {
            role: "assistant",
            text: "My answer",
            citations: [
              { source: "Rule_1", score: 0.98765, url: "a" },
              { source: "Rule_1", score: 0.11111, url: "b" },
              { source: "Rule_2", score: 0.22222, url: "c" },
            ],
          },
        ]}
      />
    );

    expect(screen.getByText("My question")).toBeInTheDocument();
    expect(screen.getByText("My answer")).toBeInTheDocument();
    expect(screen.getByText(/accuracy: 0\.9877/i)).toBeInTheDocument();
    expect(screen.getByText(/sources \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText("Rule 1")).toBeInTheDocument();
    expect(screen.getByText("Rule 2")).toBeInTheDocument();
  });

  test("shows waiting message while sending", () => {
    render(<LawGPTMessageList messages={[]} isSending={true} />);

    expect(screen.getByText(/waiting for response/i)).toBeInTheDocument();
  });
});