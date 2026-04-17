module.exports = {
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/test/styleMock.js",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/test/fileMock.js"
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "src/api/chat.api.js",
    "src/api/documents.api.js",
    "src/utils/citations.js",
    "src/contexts/Counter/CounterProvider.jsx",
    "src/contexts/authContext/index.jsx",
    "src/components/Settings/ProfileSettingsPanel.jsx",
    "src/components/Settings/SettingsTabs.jsx",
    "src/components/lawgpt/LawGPTChatInput.jsx",
    "src/components/lawgpt/LawGPTMessageList.jsx",
    "src/components/lawgpt/LawGPTSidebar.jsx",
    "src/pages/Create.jsx",
    "src/pages/SignIn.jsx",
    "src/pages/ForgotPassword.jsx",
    "src/pages/DocumentUpload.jsx",
    "src/pages/DocumentLibrary.jsx",
    "src/pages/Settings.jsx",
    "src/pages/LawGPT.jsx",
    "src/firebase/auth.js",
    "src/firebase/firebase.js",
  ],

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
};