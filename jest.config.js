module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['./tests/setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,js,vue}", "!**/node_modules/**"]
}
