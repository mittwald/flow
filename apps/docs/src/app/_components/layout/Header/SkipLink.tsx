"use client";

import { type FC } from "react";
import { Button } from "@mittwald/flow-react-components";

import styles from "./SkipLink.module.scss";

export const SkipLink: FC = () => {
  const handlePress = () => {
    document.getElementById("main-content")?.focus();
  };

  return (
    <Button
      className={styles.skipLink}
      color="secondary"
      variant="soft"
      size="s"
      onPress={handlePress}
    >
      Zum Inhalt springen
    </Button>
  );
};
