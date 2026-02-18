import "../src/styles";
import type { Preview } from "@storybook/react";
import React from "react";

const preview: Preview = {
  decorators: [
    (Story) => {
      document.body.classList.add("flow");
      return <Story />;
    },
  ],
  globalTypes: {
    rtlDirection: {},
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        default: { name: "default", value: "#fff" },
        dark: { name: "Dark", value: "#002A7B" },
        light: { name: "Light", value: "#F4F8FC" },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "default" },
  },
};

export default preview;
