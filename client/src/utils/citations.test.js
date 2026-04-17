import { cleanSourceName, extractUniqueSources } from "./citations";

describe("citations utils", () => {
  test("cleanSourceName returns fallback for empty input", () => {
    expect(cleanSourceName("")).toBe("Unknown source");
    expect(cleanSourceName()).toBe("Unknown source");
  });

  test("cleanSourceName decodes, removes underscores, normalizes spaces, and fixes section symbol", () => {
    expect(cleanSourceName("My_File%20Name__Â§_10")).toBe("My File Name § 10");
  });

  test("cleanSourceName leaves malformed uri as-is and still cleans text", () => {
    expect(cleanSourceName("%E0%A4%A_bad__name")).toBe("%E0%A4%A bad name");
  });

  test("extractUniqueSources returns unique cleaned sources", () => {
    const result = extractUniqueSources([
      { source: "Rule_1", url: "a", score: 0.9 },
      { source: "Rule_1", url: "b", score: 0.1 },
      { source: "Rule_2", url: "c", score: 0.7 },
      {},
    ]);

    expect(result).toEqual([
      { source: "Rule 1", url: "a", score: 0.9 },
      { source: "Rule 2", url: "c", score: 0.7 },
      { source: "Unknown source", url: "", score: undefined },
    ]);
  });

  test("extractUniqueSources handles empty citations", () => {
    expect(extractUniqueSources()).toEqual([]);
    expect(extractUniqueSources([])).toEqual([]);
  });
});