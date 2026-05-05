import "../src/styles";
import type { Preview } from "@storybook/react";
import React, { useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { addons } from "storybook/manager-api";

const ThemeDecorator: React.FC<{
  children: React.ReactNode;
  theme: string;
}> = ({ children, theme }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (theme) setTheme(theme);
    const channel = addons.getChannel();
    channel.emit("set-manager-theme", theme);
  }, [theme, setTheme]);

  return <>{children}</>;
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;

      document.body.style.backgroundColor =
        theme === "dark" ? "#1b1f24" : "#FFF";

      return (
        <ThemeProvider attribute="data-flow-theme">
          <ThemeDecorator theme={theme}>
            <Story />
          </ThemeDecorator>
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    rtlDirection: {},
    theme: {
      name: "theme",
      description: "Light/Dark Mode",
      defaultValue: "light",
      toolbar: {
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "default" },
  },
};

export default preview;
