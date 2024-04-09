import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabTitle.module.scss";
import { Text } from "@/components/Text";

export interface TabTitleProps
  extends Omit<Aria.TabProps, "children">,
    PropsWithChildren {
  /** @internal */
  shouldRender?: boolean;
}

export const TabTitle: FC<TabTitleProps> = (props) => {
  const { children, className, shouldRender = false, ...rest } = props;

  if (!shouldRender) {
    return null;
  }

  const rootClassName = clsx(styles.tab, className);

  return (
    <Aria.Tab className={rootClassName} {...rest}>
      <Text emulateBoldWidth>{children}</Text>
    </Aria.Tab>
  );
};

export default TabTitle;
