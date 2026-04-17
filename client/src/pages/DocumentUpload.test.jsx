import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DocumentUploadPage from "./DocumentUpload";

const mockUpload = jest.fn();
const mockRecordUpload = jest.fn();

jest.mock("../api/documents.api", () => ({
  uploadDocumentToBackend: (...args) => mockUpload(...args),
}));

jest.mock("../contexts/Counter/CounterProvider", () => ({
  useCounter: () => ({
    recordUpload: (...args) => mockRecordUpload(...args),
  }),
}));

jest.mock("../components/DocumentDashboard/DocumentsHeader.jsx", () => ({
  __esModule: true,
  default: ({ title }) => <div>{title}</div>,
}));

jest.mock("../components/DocumentDashboard/DocumentUploadPanel.jsx", () => ({
  __esModule: true,
  default: ({
    fileInputRef,
    handleOpenExplorer,
    handleFileChange,
    handleClearStaged,
    handleUploadAll,
    documents,
    stagedCount,
    isUploading,
  }) => (
    <div>
      <input
        aria-label="hidden-file-input"
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handleOpenExplorer}>open explorer</button>
      <button onClick={handleUploadAll}>upload all</button>
      <button onClick={handleClearStaged}>clear staged</button>
      <div>docs:{documents.length}</div>
      <div>staged:{stagedCount}</div>
      <div>uploading:{String(isUploading)}</div>
    </div>
  ),
}));

jest.mock("../components/DocumentDashboard/StagingArea.jsx", () => ({
  __esModule: true,
  default: ({ documents, formatSize, handleRemoveDocument, isUploading }) => (
    <div>
      <div>uploading-flag:{String(isUploading)}</div>
      {documents.map((doc) => (
        <div key={doc.id}>
          <span>{doc.name}</span>
          <span>-{doc.status}</span>
          <span>-{doc.error || "no-error"}</span>
          <span>-{formatSize(doc.size)}</span>
          <button onClick={() => handleRemoveDocument(doc.id)}>
            remove-{doc.name}
          </button>
        </div>
      ))}
    </div>
  ),
}));

describe("DocumentUploadPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("opens file explorer through ref click", () => {
    const clickSpy = jest.spyOn(HTMLInputElement.prototype, "click");

    render(<DocumentUploadPage />);

    fireEvent.click(screen.getByText("open explorer"));

    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  test("does nothing when no files are selected", () => {
    render(<DocumentUploadPage />);

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [] },
    });

    expect(screen.getByText("docs:0")).toBeInTheDocument();
    expect(screen.getByText("staged:0")).toBeInTheDocument();
  });

  test("stages selected files and formats sizes", () => {
    render(<DocumentUploadPage />);

    const fileA = new File(["x"], "contract.pdf", { type: "application/pdf" });
    Object.defineProperty(fileA, "size", { value: 500 });

    const fileB = new File(["y".repeat(2048)], "notes.txt", { type: "text/plain" });
    Object.defineProperty(fileB, "size", { value: 2048 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [fileA, fileB], value: "fake-path" },
    });

    expect(screen.getByText("docs:2")).toBeInTheDocument();
    expect(screen.getByText("staged:2")).toBeInTheDocument();
    expect(screen.getByText(/contract\.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/notes\.txt/i)).toBeInTheDocument();
    expect(screen.getByText(/-500 B/i)).toBeInTheDocument();
    expect(screen.getByText(/-2\.0 KB/i)).toBeInTheDocument();
  });

  test("uploads staged file successfully", async () => {
    mockUpload.mockResolvedValue({ uploaded: true });
    mockRecordUpload.mockResolvedValue(undefined);

    render(<DocumentUploadPage />);

    const file = new File(["x"], "contract.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 1500 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("upload all"));

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith(file, { title: "contract.pdf" });
    });

    await waitFor(() => {
      expect(mockRecordUpload).toHaveBeenCalledWith("contract.pdf");
    });

    await waitFor(() => {
      expect(screen.getByText(/contract\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/-uploaded/i)).toBeInTheDocument();
    });
  });

  test("marks failed upload using err.message", async () => {
    mockUpload.mockRejectedValue(new Error("Upload broke"));

    render(<DocumentUploadPage />);

    const file = new File(["x"], "broken.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 1200 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("upload all"));

    await waitFor(() => {
      expect(screen.getByText(/broken\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/-failed/i)).toBeInTheDocument();
      expect(screen.getByText(/-Upload broke/i)).toBeInTheDocument();
    });
  });

  test("marks failed upload using fallback message when err.message is missing", async () => {
    mockUpload.mockRejectedValue({});

    render(<DocumentUploadPage />);

    const file = new File(["x"], "fallback.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 900 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("upload all"));

    await waitFor(() => {
      expect(screen.getByText(/fallback\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/-failed/i)).toBeInTheDocument();
      expect(screen.getByText(/-Upload failed/i)).toBeInTheDocument();
    });
  });

  test("stagedCount includes failed files and excludes uploaded files", async () => {
    mockUpload
      .mockRejectedValueOnce(new Error("bad one"))
      .mockResolvedValueOnce({ ok: true });
    mockRecordUpload.mockResolvedValue(undefined);

    render(<DocumentUploadPage />);

    const file1 = new File(["a"], "bad.pdf", { type: "application/pdf" });
    Object.defineProperty(file1, "size", { value: 100 });

    const file2 = new File(["b"], "good.pdf", { type: "application/pdf" });
    Object.defineProperty(file2, "size", { value: 100 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [file1, file2] },
    });

    expect(screen.getByText("staged:2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("upload all"));

    await waitFor(() => {
      expect(screen.getByText(/bad\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/good\.pdf/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("staged:1")).toBeInTheDocument();
    });
  });

  test("removes a document when not uploading", () => {
    render(<DocumentUploadPage />);

    const file = new File(["x"], "remove-me.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 222 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [file] },
    });

    expect(screen.getByText(/remove-me\.pdf/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("remove-remove-me.pdf"));

    expect(screen.queryByText(/remove-me\.pdf/i)).not.toBeInTheDocument();
    expect(screen.getByText("docs:0")).toBeInTheDocument();
  });

  test("does not remove documents while uploading", async () => {
    let releaseUpload;
    mockUpload.mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseUpload = resolve;
        })
    );
    mockRecordUpload.mockResolvedValue(undefined);

    render(<DocumentUploadPage />);

    const file = new File(["x"], "locked.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 123 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("upload all"));

    await waitFor(() => {
      expect(screen.getByText("uploading:true")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("remove-locked.pdf"));

    expect(screen.getByText(/locked\.pdf/i)).toBeInTheDocument();

    releaseUpload({ ok: true });

    await waitFor(() => {
      expect(screen.getByText("uploading:false")).toBeInTheDocument();
    });
  });

  test("clears only non-uploaded files when not uploading", async () => {
    mockUpload
      .mockResolvedValueOnce({ ok: true })
      .mockRejectedValueOnce(new Error("bad"));
    mockRecordUpload.mockResolvedValue(undefined);

    render(<DocumentUploadPage />);

    const uploadedFile = new File(["a"], "uploaded.pdf", { type: "application/pdf" });
    Object.defineProperty(uploadedFile, "size", { value: 100 });

    const failedFile = new File(["b"], "failed.pdf", { type: "application/pdf" });
    Object.defineProperty(failedFile, "size", { value: 100 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [uploadedFile, failedFile] },
    });

    fireEvent.click(screen.getByText("upload all"));

    await waitFor(() => {
      expect(screen.getByText(/uploaded\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/failed\.pdf/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("clear staged"));

    expect(screen.getByText(/uploaded\.pdf/i)).toBeInTheDocument();
    expect(screen.queryByText(/failed\.pdf/i)).not.toBeInTheDocument();
  });

  test("does not clear staged files while uploading", async () => {
    let releaseUpload;
    mockUpload.mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseUpload = resolve;
        })
    );
    mockRecordUpload.mockResolvedValue(undefined);

    render(<DocumentUploadPage />);

    const file = new File(["x"], "keep.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 321 });

    fireEvent.change(screen.getByLabelText("hidden-file-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText("upload all"));

    await waitFor(() => {
      expect(screen.getByText("uploading:true")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("clear staged"));

    expect(screen.getByText(/keep\.pdf/i)).toBeInTheDocument();

    releaseUpload({ ok: true });

    await waitFor(() => {
      expect(screen.getByText("uploading:false")).toBeInTheDocument();
    });
  });

  test("does nothing when upload all is clicked with no staged documents", () => {
    render(<DocumentUploadPage />);

    fireEvent.click(screen.getByText("upload all"));

    expect(mockUpload).not.toHaveBeenCalled();
    expect(screen.getByText("docs:0")).toBeInTheDocument();
  });
});