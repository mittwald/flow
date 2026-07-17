"use client";

import { Button, Icon, Text } from "@mittwald/flow-react-components";
import { IconContrastFilled, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import type { FC } from "react";

interface Props {
  iconOnly?: boolean;
}

export const ThemeSwitcherButton: FC<Props> = (props) => {
  const { iconOnly } = props;

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
      variant={iconOnly ? "plain" : "soft"}
      color="secondary"
      slot="primary"
      style={{ flexGrow: 0, width: "auto" }}
    >
      <Icon>{icon}</Icon>
      {!iconOnly && (
        <Text>
          {theme === "light"
            ? "Heller Farbmodus"
            : theme === "dark"
              ? "Dunkler Farbmodus"
              : "System-Farbmodus"}
        </Text>
      )}
    </Button>
  );
};
