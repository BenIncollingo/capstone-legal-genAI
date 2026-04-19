import * as db from "./index.js";

describe("database", () => {
  test("exports database object", () => {
    expect(db).toBeDefined();
  });
});