import type { StorybookConfig } from '@storybook/nextjs-vite';
import pkg from '@next/env';
const { loadEnvConfig } = pkg;

const envConfig = loadEnvConfig(process.cwd());

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": ["@storybook/addon-themes"],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "..\\public"
  ],
  viteFinal(config) {
    const define: Record<string, string> = {};
    for (const [key, value] of Object.entries(envConfig.combinedEnv)) {
      if (key.startsWith("NEXT_PUBLIC_")) {
        define[`process.env.${key}`] = JSON.stringify(value);
      }
    }
    config.define = { ...config.define, ...define };
    return config;
  },
};
export default config;