import type { FC, PropsWithChildren } from "react";
import React from "react";
import type * as Aria from "react-aria-components";
import styles from "../../MenuItem.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import {
  IconCheckboxChecked,
  IconCheckboxEmpty,
  IconRadioOff,
  IconRadioOn,
} from "@/components/Icon/components/icons";
import clsx from "clsx";
import { Switch } from "@/components/Switch";

interface Props extends Aria.MenuItemRenderProps, PropsWithChildren {
  selectionVariant?: "control" | "navigation" | "switch";
}

export const MenuItemContent: FC<Props> = (props) => {
  const {
    selectionMode,
    isSelected,
    selectionVariant = "control",
    children,
  } = props;

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
    },
    Avatar: {
      className: styles.avatar,
    },
  };

  const controlIconPropsContext: PropsContext = {
    Icon: {
      className: clsx(styles.controlIcon, styles.icon),
    },
    Switch: {
      className: clsx(styles.controlIcon, styles.switch),
    },
  };

  const selectionIcon =
    selectionMode === "none" ||
    selectionVariant === "navigation" ? null : selectionVariant === "switch" ? (
      <Switch isReadOnly isSelected={isSelected} />
    ) : selectionMode === "single" && isSelected ? (
      <IconRadioOn />
    ) : selectionMode === "single" && !isSelected ? (
      <IconRadioOff />
    ) : selectionMode === "multiple" && isSelected ? (
      <IconCheckboxChecked />
    ) : (
      <IconCheckboxEmpty />
    );

  return (
    <>
      <PropsContextProvider props={controlIconPropsContext}>
        {selectionIcon}
      </PropsContextProvider>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </>
  );
};
