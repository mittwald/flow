import { Activity } from "@/components/Activity";
import { TabContextProvider } from "@/components/Tabs/components/Tab/context";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelEntry } from "@mittwald/react-tunnel";
import clsx from "clsx";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { useId } from "react";
import type { TabPanelRenderProps } from "react-aria-components";
import * as Aria from "react-aria-components";
import styles from "./Tab.module.scss";

export interface TabProps
  extends Omit<Aria.TabPanelProps, "children">,
    PropsWithChildren {}

/** @flr-generate all */
export const Tab: FC<TabProps> = (props) => {
  const { children, className, id: idFromProps, ...rest } = props;

  const rootClassName = clsx(styles.tabPanel, className);

  const generatedId = useId();
  const id = idFromProps ?? generatedId;

  const TabPanelRenderer = (props: TabPanelRenderProps): Awaited<ReactNode> => {
    const isSelected = props.state.selectedKey === id;

    const propsContext: PropsContext = {
      Content: {
        wrapWith: <Activity isActive={isSelected} />,
      },
      Section: {
        wrapWith: <Activity isActive={isSelected} />,
      },
    };

    return (
      <PropsContextProvider
        props={propsContext}
        dependencies={[isSelected, children]}
      >
        {children}
      </PropsContextProvider>
    );
  };

  return (
    <TunnelEntry id="Panels">
      <TabContextProvider value={{ id }}>
        <Aria.TabPanel
          className={rootClassName}
          shouldForceMount
          id={id}
          {...rest}
        >
          {TabPanelRenderer}
        </Aria.TabPanel>
      </TabContextProvider>
    </TunnelEntry>
  );
};

export default Tab;
