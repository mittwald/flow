import "../src/styles";
import type { Preview } from "@storybook/react";
import React from "react";

const preview: Preview = {
  decorators: [
    (Story) => {
      document.body.classList.add("flow-mstudio");
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
  },
};

export default preview;
