import type { StorybookConfig } from "@storybook/react-vite";
import viteCheckerPlugin from "vite-plugin-checker";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "storybook-addon-rtl",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      // no options
    },
  },
  core: {
    disableTelemetry: true,
    builder: "@storybook/builder-vite",
  },
  viteFinal: async (conf) => {
    return mergeConfig(conf, {
      plugins: [
        viteCheckerPlugin({
          typescript: true,
          terminal: true,
        }),
      ],
    });
  },
};

export default config;
