/** @type {import("ts-jest").JestConfigWithTsJest} */
export default {
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  coverageReporters: ["json-summary"],
};
