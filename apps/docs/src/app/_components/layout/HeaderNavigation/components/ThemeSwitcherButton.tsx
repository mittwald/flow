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

  const ariaLabel =
    theme === "light"
      ? "Zum dunklen Farbmodus wechseln, heller Farbmodus aktiv"
      : theme === "dark"
        ? "Zum System-Farbmodus wechseln, dunkler Farbmodus aktiv"
        : "Zum hellen Farbmodus wechseln, System-Farbmodus aktiv";

  return (
    <Button
      onPress={toggleTheme}
      aria-label={ariaLabel}
      variant="plain"
      color="secondary"
      slot="primary"
      style={{ flexGrow: 0, width: "auto" }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};
