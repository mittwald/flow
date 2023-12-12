import nextJest from "next/jest.js";
import { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./src",
});

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
};

export default createJestConfig(config);
