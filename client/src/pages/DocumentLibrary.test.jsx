import React from "react";
import { render, screen } from "@testing-library/react";
import DocumentLibraryPage from "./DocumentLibrary";

const mockUseCounter = jest.fn();

jest.mock("../contexts/Counter/CounterProvider", () => ({
  useCounter: () => mockUseCounter(),
}));

jest.mock("../components/DocumentDashboard/DocumentsHeader.jsx", () => ({
  __esModule: true,
  default: ({ title }) => <div>{title}</div>,
}));

jest.mock("../components/DocumentDashboard/DocumentLibraryList.jsx", () => ({
  __esModule: true,
  default: ({ files }) => <div>files:{files.length}</div>,
}));

describe("DocumentLibrary page", () => {
  test("renders recent files from stats", () => {
    mockUseCounter.mockReturnValue({
      stats: { recentFiles: ["a.pdf", "b.pdf"] },
    });

    render(<DocumentLibraryPage />);

    expect(screen.getByText(/document library/i)).toBeInTheDocument();
    expect(screen.getByText("files:2")).toBeInTheDocument();
  });

  test("falls back to empty recent files", () => {
    mockUseCounter.mockReturnValue({
      stats: undefined,
    });

    render(<DocumentLibraryPage />);

    expect(screen.getByText("files:0")).toBeInTheDocument();
  });
});