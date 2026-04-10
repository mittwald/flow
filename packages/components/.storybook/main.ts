import type { StorybookConfig } from "@storybook/react-vite";
import viteCheckerPlugin from "vite-plugin-checker";

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
  viteFinal: async (conf) => {
    // See why dynamic import: see https://github.com/storybookjs/storybook/issues/26291#issuecomment-1978193283
    const { mergeConfig } = await import("vite");

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
