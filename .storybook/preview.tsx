import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from '@storybook/addon-themes';
import React from "react";
import { AuthProvider } from "../components/auth/AuthProvider";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => React.createElement(AuthProvider, null, React.createElement(Story)),
  ],
};

export default preview;
