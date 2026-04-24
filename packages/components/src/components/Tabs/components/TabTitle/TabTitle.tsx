import type { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabTitle.module.scss";
import { Text } from "@/components/Text";
import { useTabContext } from "@/components/Tabs/components/Tab/context";
import { MenuItem } from "@/components/MenuItem";
import { UiComponentTunnelEntry } from "@/components/UiComponentTunnel/UiComponentTunnelEntry";

export interface TabTitleProps
  extends
    Omit<Aria.TabProps, "children" | "id" | "isDisabled">,
    PropsWithChildren {}

/** @flr-generate all */
export const TabTitle: FC<TabTitleProps> = (props) => {
  const { children, className, ...rest } = props;

  const { id } = useTabContext();
  const titleClassName = clsx(styles.tabTitle, className);

  return (
    <>
      <UiComponentTunnelEntry id="Titles" component="Tabs">
        <Aria.Tab {...rest} id={id} className={titleClassName}>
          {(p) => (
            <>
              <Text emulateBoldWidth>
                <span className={styles.text}>{children}</span>
              </Text>
              <UiComponentTunnelEntry id="ActiveTitle" component="Tabs">
                {p.isSelected && children}
              </UiComponentTunnelEntry>
            </>
          )}
        </Aria.Tab>
      </UiComponentTunnelEntry>

      <UiComponentTunnelEntry id="ContextMenuItems" component="Tabs">
        <MenuItem className={styles.menuItem} id={id}>
          {children}
        </MenuItem>
      </UiComponentTunnelEntry>
    </>
  );
};

export default TabTitle;
