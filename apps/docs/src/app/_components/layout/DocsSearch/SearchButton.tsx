"use client";
import { type FC, useEffect, useState } from "react";
import { IconSearch, Kbd, Text } from "@mittwald/flow-react-components";
import type { OverlayController } from "@mittwald/flow-react-components";
import clsx from "clsx";
import styles from "./DocsSearch.module.scss";

interface Props {
  controller: OverlayController;
  className?: string;
  iconOnly?: boolean;
}

export const SearchButton: FC<Props> = ({
  controller,
  className,
  iconOnly,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      className={clsx(styles.trigger, iconOnly && styles.iconOnly, className)}
      onClick={() => controller.open()}
      aria-label={iconOnly ? "Dokumentation durchsuchen" : undefined}
    >
      <IconSearch />
      {!iconOnly && (
        <>
          <Text>Suche</Text>
          {mounted && (
            <span className={styles.triggerKbd} aria-hidden>
              <Kbd keys={["mod", "k"]} />
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default SearchButton;
