import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabTitle.module.scss";
import { Text } from "@/components/Text";
import { useSetChildProps } from "@/lib/childProps";
import { useTabTabContext } from "@/components/Tabs/components/Tab/context";

export interface TabTitleProps
  extends Omit<Aria.TabProps, "children">,
    PropsWithChildren {
  /** @internal */
  shouldRender?: boolean;
}

export const TabTitle: FC<TabTitleProps> = (props) => {
  const {
    children,
    className,
    shouldRender = false,
    id: idFromProps,
    ...rest
  } = props;

  const context = useTabTabContext();
  const id = idFromProps ?? context.id;

  if (!shouldRender) {
    useSetChildProps("TabTitle", {
      ...props,
      id,
    });
    return null;
  }

  const rootClassName = clsx(styles.tab, className);

  return (
    <Aria.Tab className={rootClassName} {...rest} id={id}>
      <Text emulateBoldWidth>{children}</Text>
    </Aria.Tab>
  );
};

export default TabTitle;
