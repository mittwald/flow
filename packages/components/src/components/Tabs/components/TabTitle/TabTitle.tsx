import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabTitle.module.scss";
import { Text } from "@/components/Text";
import { useTabContext } from "@/components/Tabs/components/Tab/context";
import { TunnelEntry } from "@mittwald/react-tunnel";
import { MenuItem } from "@/components/MenuItem";
import { StatusIcon } from "@/components/StatusIcon";
import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export interface TabTitleProps
  extends Omit<Aria.TabProps, "children" | "id" | "isDisabled">,
    PropsWithChildren {}

export const TabTitle: FC<TabTitleProps> = (props) => {
  const { children, className, ...rest } = props;

  const { id, status } = useTabContext();
  const titleClassName = clsx(styles.tabTitle, className);

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <>
      <TunnelEntry id="Titles">
        <Aria.Tab {...rest} id={id} className={titleClassName}>
          {(p) => (
            <>
              <Text emulateBoldWidth>{children}</Text>
              <TunnelEntry id="ActiveTitle">
                {p.isSelected && children}
              </TunnelEntry>
              {status && (
                <StatusIcon
                  status={status}
                  aria-label={stringFormatter.format(`tab.status.${status}`)}
                />
              )}
            </>
          )}
        </Aria.Tab>
      </TunnelEntry>

      <TunnelEntry id="ContextMenuItems">
        <MenuItem id={id}>{children}</MenuItem>
      </TunnelEntry>
    </>
  );
};

export default TabTitle;
