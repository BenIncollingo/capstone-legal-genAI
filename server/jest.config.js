export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  moduleFileExtensions: ["js"],
  transformIgnorePatterns: ["/node_modules/"],
  coverageReporters: ["text", "text-summary"],
};