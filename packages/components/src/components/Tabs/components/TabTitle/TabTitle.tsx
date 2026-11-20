import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./TabTitle.module.scss";
import { Text } from "@/components/Text";
import { useTabContext } from "@/components/Tabs/components/Tab/context";
import { MenuItem } from "@/components/MenuItem";
import { UiComponentTunnelEntry } from "@/components/UiComponentTunnel/UiComponentTunnelEntry";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface TabTitleProps
  extends
    Omit<Aria.TabProps, "children" | "id" | "isDisabled">,
    PropsWithChildren,
    FlowComponentProps {}

/** @flr-generate all */
export const TabTitle = flowComponent("TabTitle", (props) => {
  const { children, className, ref, ...rest } = props;

  const { id } = useTabContext();
  const isSkeleton = useSkeletonMode();

  const titleClassName = clsx(
    styles.tabTitle,
    isSkeleton && styles.skeleton,
    className,
  );

  return (
    <>
      <UiComponentTunnelEntry id="Titles" component="Tabs">
        <Aria.Tab {...rest} id={id} className={titleClassName} ref={ref}>
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
        <MenuItem {...rest} className={styles.menuItem} id={id}>
          {children}
        </MenuItem>
      </UiComponentTunnelEntry>
    </>
  );
});

export default TabTitle;
