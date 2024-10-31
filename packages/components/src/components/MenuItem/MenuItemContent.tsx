import type { FC, PropsWithChildren } from "react";
import React from "react";
import type * as Aria from "react-aria-components";
import styles from "./MenuItem.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import {
  IconCheckboxChecked,
  IconCheckboxEmpty,
  IconRadioOff,
  IconRadioOn,
} from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";
import { deepHas } from "@/lib/react/deepHas";
import { Wrap } from "@/components/Wrap";
import clsx from "clsx";
import { Avatar } from "@/components/Avatar";

interface Props extends Aria.MenuItemRenderProps, PropsWithChildren {
  selectionVariant?: "control" | "navigation";
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
    Text: {
      className: styles.text,
    },
    Avatar: {
      className: styles.avatar,
    },
  };

  const controlIconPropsContext: PropsContext = {
    Icon: {
      className: clsx(styles.controlIcon, styles.icon),
    },
  };

  const selectionIcon =
    selectionMode === "none" ||
    selectionVariant === "navigation" ? null : selectionMode === "single" &&
      isSelected ? (
      <IconRadioOn />
    ) : selectionMode === "single" && !isSelected ? (
      <IconRadioOff />
    ) : selectionMode === "multiple" && isSelected ? (
      <IconCheckboxChecked />
    ) : (
      <IconCheckboxEmpty />
    );

  const hasText = deepHas(children, Text);
  const hasAvatar = deepHas(children, Avatar);

  return (
    <>
      <PropsContextProvider props={controlIconPropsContext}>
        {selectionIcon}
      </PropsContextProvider>
      <PropsContextProvider props={propsContext}>
        <Wrap if={!hasText && !hasAvatar}>
          <Text>{children}</Text>
        </Wrap>
      </PropsContextProvider>
    </>
  );
};
