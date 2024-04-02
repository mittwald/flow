import "../src/styles";
import { Preview } from "@storybook/react";
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
  },
};

export default preview;
