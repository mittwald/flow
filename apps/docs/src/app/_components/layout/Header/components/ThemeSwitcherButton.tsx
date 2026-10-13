"use client";

import { Button, Icon, Text } from "@mittwald/flow-react-components";
import {
  faCircleHalfStroke,
  faMoon,
  faSun,
} from "@fortawesome/sharp-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "@teispace/next-themes";
import { useEffect, useState, type FC } from "react";

interface Props {
  iconOnly?: boolean;
}

export const ThemeSwitcherButton: FC<Props> = (props) => {
  const { iconOnly } = props;

  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const currentTheme = mounted ? theme : undefined;

  const toggleTheme = () => {
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
  };

  const icon =
    currentTheme === "light" ? (
      <FontAwesomeIcon icon={faSun} />
    ) : currentTheme === "dark" ? (
      <FontAwesomeIcon icon={faMoon} />
    ) : (
      <FontAwesomeIcon icon={faCircleHalfStroke} />
    );

  const ariaLabel =
    currentTheme === "light"
      ? "Zum dunklen Farbmodus wechseln, heller Farbmodus aktiv"
      : currentTheme === "dark"
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
          {currentTheme === "light"
            ? "Heller Farbmodus"
            : currentTheme === "dark"
              ? "Dunkler Farbmodus"
              : "System-Farbmodus"}
        </Text>
      )}
    </Button>
  );
};
