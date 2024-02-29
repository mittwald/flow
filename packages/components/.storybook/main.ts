import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import viteCheckerPlugin from "vite-plugin-checker";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "storybook-addon-dir",
    "storybook-addon-pseudo-states",
  ],
  framework: "@storybook/react-vite",
  core: {
    builder: "@storybook/builder-vite",
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: (conf, {}) =>
    mergeConfig(conf, {
      plugins: [
        viteCheckerPlugin({
          typescript: true,
          terminal: true,
        }),
      ],
    }),
};

export default config;
