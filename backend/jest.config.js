export default {
  testEnvironment: "node",
  transform: {},
  collectCoverage: true,
  collectCoverageFrom: [
    "controllers/**/*.js",
    "routes/**/*.js",
    "!**/node_modules/**",
    "!**/prisma/**",
  ],
  coverageDirectory: "coverage",
};