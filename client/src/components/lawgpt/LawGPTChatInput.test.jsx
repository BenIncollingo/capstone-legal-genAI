import { render, screen, fireEvent } from "@testing-library/react";
import LawGPTChatInput from "./LawGPTChatInput";

describe("LawGPTChatInput", () => {
  test("updates message on change", () => {
    const setMessage = jest.fn();

    render(
      <LawGPTChatInput
        message=""
        setMessage={setMessage}
        onSend={jest.fn()}
        isSending={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/ask a legal question/i), {
      target: { value: "hello" },
    });

    expect(setMessage).toHaveBeenCalledWith("hello");
  });

  test("sends on button click", () => {
    const onSend = jest.fn();

    render(
      <LawGPTChatInput
        message="hello"
        setMessage={jest.fn()}
        onSend={onSend}
        isSending={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(onSend).toHaveBeenCalled();
  });

  test("sends on Enter without Shift", () => {
    const onSend = jest.fn();

    render(
      <LawGPTChatInput
        message="hello"
        setMessage={jest.fn()}
        onSend={onSend}
        isSending={false}
      />
    );

    fireEvent.keyDown(screen.getByPlaceholderText(/ask a legal question/i), {
      key: "Enter",
      shiftKey: false,
      preventDefault: jest.fn(),
    });

    expect(onSend).toHaveBeenCalled();
  });

  test("does not send on Shift+Enter and disables controls while sending", () => {
    const onSend = jest.fn();

    render(
      <LawGPTChatInput
        message="hello"
        setMessage={jest.fn()}
        onSend={onSend}
        isSending={true}
      />
    );

    const textarea = screen.getByPlaceholderText(/ask a legal question/i);
    const button = screen.getByRole("button", { name: /send/i });

    expect(textarea).toBeDisabled();
    expect(button).toBeDisabled();

    fireEvent.keyDown(textarea, {
      key: "Enter",
      shiftKey: true,
      preventDefault: jest.fn(),
    });

    expect(onSend).not.toHaveBeenCalled();
  });
});