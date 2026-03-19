"use client";

import { Button, Icon } from "@mittwald/flow-react-components";
import { IconContrastFilled, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export const ThemeSwitcherButton = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
  };

  const icon =
    theme === "light" ? (
      <IconSun />
    ) : theme === "dark" ? (
      <IconMoon />
    ) : (
      <IconContrastFilled />
    );

  return (
    <Button onPress={toggleTheme} aria-hidden="true">
      <Icon>{icon}</Icon>
    </Button>
  );
};
