import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Path to your Next.js app
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  
  moduleNameMapper: {
    // if you have custom stuff add here
  },
};

export default createJestConfig(config);
// module.exports = createJestConfig(config);