import "../src/styles";
import type { Preview } from "@storybook/react";
import type React from "react";
import { useEffect } from "react";
/*
 * The `/client` entry, not the package root: the root entry imports
 * `next/navigation`, whose Next.js internals reference `process` at module
 * scope. Storybook's preview is plain Vite with no Next runtime, so that throws
 * `process is not defined` while the dependency is being evaluated and the
 * preview never renders. Same API, generic React.
 */
import { ThemeProvider, useTheme } from "@teispace/next-themes/client";
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
        <ThemeProvider attribute="data-theme">
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
