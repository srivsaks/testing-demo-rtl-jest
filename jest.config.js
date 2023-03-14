module.exports = {
  collectCoverage: true,
  verbose: true,
  collectCoverageFrom: ["src/**/*.{js,jsx}"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["js", "jsx", "css"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  roots: ["src"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
