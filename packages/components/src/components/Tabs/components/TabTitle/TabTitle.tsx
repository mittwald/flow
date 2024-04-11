import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabTitle.module.scss";
import { Text } from "@/components/Text";
import { useTabTabContext } from "@/components/Tabs/components/Tab/context";
import { TunnelEntry } from "@mittwald/react-tunnel";

export interface TabTitleProps
  extends Omit<Aria.TabProps, "children" | "id">,
    PropsWithChildren {}

export const TabTitle: FC<TabTitleProps> = (props) => {
  const { children, className, ...rest } = props;

  const context = useTabTabContext();

  const rootClassName = clsx(styles.tabTitle, className);

  return (
    <TunnelEntry id="TabTitles">
      <Aria.Tab className={rootClassName} {...rest} id={context.id}>
        <Text emulateBoldWidth>{children}</Text>
      </Aria.Tab>
    </TunnelEntry>
  );
};

export default TabTitle;
