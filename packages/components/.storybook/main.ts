import type { StorybookConfig } from "@storybook/react-vite";

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
};

export default config;
