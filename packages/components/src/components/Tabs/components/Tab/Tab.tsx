import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Tab.module.scss";
import { Text } from "@/components/Text";

export interface TabProps
  extends Omit<Aria.TabProps, "children">,
    PropsWithChildren {}

export const Tab: FC<TabProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.tab, className);

  return (
    <Aria.Tab className={rootClassName} {...rest}>
      <Text emulateBoldWidth>{children}</Text>
    </Aria.Tab>
  );
};

export default Tab;
