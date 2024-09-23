import type { Config } from "jest";
import nextJest from "next/jest";

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jestAfterEnv.setup.ts"],
};

export default createJestConfig(config);
