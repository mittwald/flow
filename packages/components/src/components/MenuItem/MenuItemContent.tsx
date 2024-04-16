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

type Props = Aria.MenuItemRenderProps & PropsWithChildren;

export const MenuItemContent: FC<Props> = (props) => {
  const { selectionMode, isSelected, children } = props;

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
    },
    Text: {
      className: styles.text,
    },
  };

  const selectionIcon =
    selectionMode === "none" ? null : selectionMode === "single" &&
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

  return (
    <PropsContextProvider props={propsContext}>
      {selectionIcon}
      <Wrap if={!hasText}>
        <Text>{children}</Text>
      </Wrap>
    </PropsContextProvider>
  );
};
