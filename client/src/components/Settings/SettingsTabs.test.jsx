import { render, screen, fireEvent } from "@testing-library/react";
import SettingsTabs from "./SettingsTabs";

describe("SettingsTabs", () => {
  test("renders tabs and switches active tab", () => {
    const setActiveTab = jest.fn();

    render(
      <SettingsTabs
        tabs={[
          { key: "profile", label: "Profile" },
          { key: "terms", label: "Terms" },
        ]}
        activeTab="profile"
        setActiveTab={setActiveTab}
      />
    );

    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Terms" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Terms" }));
    expect(setActiveTab).toHaveBeenCalledWith("terms");
  });
});