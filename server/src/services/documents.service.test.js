import * as docService from "./documents.service.js";

describe("documents.service", () => {
  test("uploads document successfully", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    });

    const file = new Blob(["test"]);
    const res = await docService.uploadDocumentToBackend(file, { title: "doc" });

    expect(global.fetch).toHaveBeenCalled();
    expect(res).toEqual({ success: true });
  });

  test("handles upload failure", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("fail"));

    await expect(
      docService.uploadDocumentToBackend(new Blob(), {})
    ).rejects.toThrow("fail");
  });
});