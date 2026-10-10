import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';

// Local fallback when there is no system Chrome: the workspace keeps a headless
// Chromium for exactly this. CI or other machines set PW_CHANNEL or
// PW_EXECUTABLE_PATH instead.
const LOCAL_SHELL = `${homedir()}/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`;
const EXEC = process.env.PW_EXECUTABLE_PATH || (existsSync(LOCAL_SHELL) ? LOCAL_SHELL : undefined);

// The e2e suite runs against the real build, because the service worker only exists there.
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4175',
    ...devices['Pixel 7'],
    // System Chrome by default (the same engine a phone runs); override with
    // PW_EXECUTABLE_PATH where no system Chrome exists.
    channel: process.env.PW_CHANNEL || undefined,
    launchOptions: { executablePath: EXEC, args: ['--no-sandbox'] }
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4175 --strictPort',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: false,
    timeout: 120_000
  }
});