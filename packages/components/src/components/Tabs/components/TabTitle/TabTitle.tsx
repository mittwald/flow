import type { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabTitle.module.scss";
import { Text } from "@/components/Text";
import { useTabContext } from "@/components/Tabs/components/Tab/context";
import { TunnelEntry } from "@mittwald/react-tunnel";
import { MenuItem } from "@/components/MenuItem";
import { tabsTunnelProviderId } from "../../config";

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
      <TunnelEntry id="Titles" providerId={tabsTunnelProviderId}>
        <Aria.Tab {...rest} id={id} className={titleClassName}>
          {(p) => (
            <>
              <Text emulateBoldWidth>
                <span className={styles.text}>{children}</span>
              </Text>
              <TunnelEntry id="ActiveTitle" providerId={tabsTunnelProviderId}>
                {p.isSelected && children}
              </TunnelEntry>
            </>
          )}
        </Aria.Tab>
      </TunnelEntry>

      <TunnelEntry id="ContextMenuItems" providerId={tabsTunnelProviderId}>
        <MenuItem className={styles.menuItem} id={id}>
          {children}
        </MenuItem>
      </TunnelEntry>
    </>
  );
};

export default TabTitle;
