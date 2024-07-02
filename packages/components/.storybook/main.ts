import { dirname, join } from "path";
import type { StorybookConfig } from "@storybook/react-vite";
import viteCheckerPlugin from "vite-plugin-checker";

function getAbsolutePath<T extends string>(value: T): T {
  return dirname(require.resolve(join(value, "package.json"))) as T;
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("storybook-addon-rtl"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
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
