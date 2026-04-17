import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileSettingsPanel from "./ProfileSettingsPanel";

describe("ProfileSettingsPanel", () => {
  test("calls reset handler", () => {
    const onReset = jest.fn();

    render(
      <ProfileSettingsPanel
        onDeleteAccount={jest.fn()}
        onReset={onReset}
        password=""
        setPassword={jest.fn()}
        checkPass={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    expect(onReset).toHaveBeenCalled();
  });

  test("shows error when password verification fails", async () => {
    const setPassword = jest.fn();
    const checkPass = jest.fn().mockResolvedValue(false);

    render(
      <ProfileSettingsPanel
        onDeleteAccount={jest.fn()}
        onReset={jest.fn()}
        password="badpass"
        setPassword={setPassword}
        checkPass={checkPass}
      />
    );

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "newpass" },
    });
    expect(setPassword).toHaveBeenCalledWith("newpass");

    fireEvent.click(screen.getByRole("button", { name: /unlock delete/i }));

    await waitFor(() => {
      expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();
    });
  });

  test("unlocks and enables delete button when password verification succeeds", async () => {
    const onDeleteAccount = jest.fn();
    const checkPass = jest.fn().mockResolvedValue(true);

    render(
      <ProfileSettingsPanel
        onDeleteAccount={onDeleteAccount}
        onReset={jest.fn()}
        password="goodpass"
        setPassword={jest.fn()}
        checkPass={checkPass}
      />
    );

    const deleteButton = screen.getByRole("button", {
      name: /permanently delete account/i,
    });
    expect(deleteButton).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /unlock delete/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /verified/i })).toBeInTheDocument();
    });

    expect(deleteButton).not.toBeDisabled();
    fireEvent.click(deleteButton);
    expect(onDeleteAccount).toHaveBeenCalled();
  });
});