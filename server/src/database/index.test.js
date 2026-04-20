import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const mockConfig = jest.fn();
const mockRelease = jest.fn();
const mockConnect = jest.fn();
const MockPool = jest.fn();

jest.unstable_mockModule("dotenv", () => ({
  default: {
    config: (...args) => mockConfig(...args),
  },
}));

jest.unstable_mockModule("pg", () => ({
  default: {
    Pool: function (...args) {
      return MockPool(...args);
    },
  },
}));

describe("database/index", () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    process.env.DB_USER = "dbuser";
    process.env.DB_PASSWORD = "pw";
    process.env.DB_NAME = "dbname";
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    delete process.env.INSTANCE_CONNECTION_NAME;
    process.env.NODE_ENV = "development";

    mockConnect.mockResolvedValue({ release: mockRelease });
    MockPool.mockImplementation((config) => ({
      connect: mockConnect,
      query: jest.fn(),
      __config: config,
    }));
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  test("creates pool with development host and logs successful connection", async () => {
    const mod = await import("./index.js");
    await Promise.resolve();

    expect(mockConfig).toHaveBeenCalled();
    expect(MockPool).toHaveBeenCalledWith({
      user: "dbuser",
      password: "pw",
      database: "dbname",
      host: "localhost",
      port: 5433,
    });
    expect(mockConnect).toHaveBeenCalled();
    expect(mockRelease).toHaveBeenCalled();
    expect(mod.default).toBeDefined();
  });

  test("uses cloudsql host in production when instance connection name exists", async () => {
    process.env.NODE_ENV = "production";
    process.env.INSTANCE_CONNECTION_NAME = "project:region:instance";

    await import("./index.js");

    expect(MockPool).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "/cloudsql/project:region:instance",
      })
    );
  });

  test("logs connection error when connect fails", async () => {
    const err = new Error("connect fail");
    mockConnect.mockRejectedValue(err);

    await import("./index.js");
    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith(
      "PostgreSQL connection error:",
      err
    );
  });
});