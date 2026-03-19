"use client";

import { storeTheme } from "@/app/_lib/themeStorage";
import {
  Button,
  Icon,
  LoadingSpinner,
  setTheme,
  useIsMounted,
  useStoredTheme,
  type Theme,
} from "@mittwald/flow-react-components";
import { IconContrastFilled, IconMoon, IconSun } from "@tabler/icons-react";

export const ThemeSwitcherButton = () => {
  const storedTheme = useStoredTheme();

  const toggleTheme = () => {
    const nextTheme: Theme =
      storedTheme === "light"
        ? "dark"
        : storedTheme === "dark"
          ? "system"
          : "light";
    setTheme(nextTheme);
    storeTheme(nextTheme);
  };

  const isMounted = useIsMounted();

  const icon =
    storedTheme === "light" ? (
      <IconSun />
    ) : storedTheme === "dark" ? (
      <IconMoon />
    ) : (
      <IconContrastFilled />
    );

  return (
    <Button onPress={toggleTheme} aria-hidden="true">
      {isMounted ? <Icon>{icon}</Icon> : <LoadingSpinner />}
    </Button>
  );
};
