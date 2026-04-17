import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { CounterProvider, useCounter } from "./CounterProvider";

const mockOnSnapshot = jest.fn();
const mockDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockIncrement = jest.fn();
const mockArrayUnion = jest.fn();

jest.mock("../../firebase/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: (...args) => mockDoc(...args),
  onSnapshot: (...args) => mockOnSnapshot(...args),
  setDoc: (...args) => mockSetDoc(...args),
  increment: (...args) => mockIncrement(...args),
  arrayUnion: (...args) => mockArrayUnion(...args),
  updateDoc: jest.fn(),
}));

function Consumer() {
  const { stats, recordUpload } = useCounter();

  return (
    <div>
      <div data-testid="total">{stats.total}</div>
      <div data-testid="recent">{(stats.recentFiles || []).join(",")}</div>
      <button onClick={() => recordUpload("file.pdf")}>record</button>
    </div>
  );
}

describe("CounterProvider", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockDoc.mockReset();
    mockOnSnapshot.mockReset();
    mockSetDoc.mockReset();
    mockIncrement.mockReset();
    mockArrayUnion.mockReset();

    mockDoc.mockReturnValue("statsRef");
    mockIncrement.mockReturnValue("inc(1)");
    mockArrayUnion.mockReturnValue("union(file.pdf)");
    mockSetDoc.mockResolvedValue(undefined);
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test("subscribes to firestore and updates stats", async () => {
    let snapshotCallback;
    const unsubscribe = jest.fn();

    mockOnSnapshot.mockImplementation((ref, cb) => {
      snapshotCallback = cb;
      return unsubscribe;
    });

    render(
      <CounterProvider>
        <Consumer />
      </CounterProvider>
    );

    await act(async () => {
      snapshotCallback({
        exists: () => true,
        data: () => ({ total: 3, recentFiles: ["a.pdf"] }),
      });
    });

    expect(screen.getByTestId("total")).toHaveTextContent("3");
    expect(screen.getByTestId("recent")).toHaveTextContent("a.pdf");
  });

  test("recordUpload writes merged firestore update", async () => {
    mockOnSnapshot.mockImplementation(() => jest.fn());

    render(
      <CounterProvider>
        <Consumer />
      </CounterProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /record/i }));
    });

    expect(mockIncrement).toHaveBeenCalledWith(1);
    expect(mockArrayUnion).toHaveBeenCalledWith("file.pdf");
    expect(mockSetDoc).toHaveBeenCalledWith(
      "statsRef",
      {
        total: "inc(1)",
        recentFiles: "union(file.pdf)",
      },
      { merge: true }
    );
  });
});