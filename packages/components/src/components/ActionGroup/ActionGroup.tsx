import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./ActionGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { ActionStateContextProvider } from "@/components/Action/models/ActionStateContext";
import { getActionGroupSlot } from "@/components/ActionGroup/lib/getActionGroupSlot";

export interface ActionGroupProps
  extends PropsWithChildren,
    FlowComponentProps,
    PropsWithClassName {}

export const ActionGroup = flowComponent("ActionGroup", (props) => {
  const { children, className, refProp: ref, ...rest } = props;

  const rootClassName = clsx(styles.actionGroupContainer, className);

  const propsContext: PropsContext = {
    Button: {
      tunnelId: dynamic((p) => getActionGroupSlot(p)),
      slot: dynamic((props) => getActionGroupSlot(props)),
      className: dynamic((props) => {
        const slot = getActionGroupSlot(props);
        return clsx(
          props.className,
          slot !== "secondary" ? styles[slot] : undefined,
        );
      }),
    },
  };

  return (
    <ActionStateContextProvider>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        <TunnelProvider>
          <div {...rest} className={rootClassName} ref={ref}>
            <div className={styles.actionGroup} role="group">
              {children}
              <TunnelExit id="primary" />
              <div className={styles.secondary}>
                <TunnelExit id="secondary" />
              </div>
              <TunnelExit id="abort" />
            </div>
          </div>
        </TunnelProvider>
      </PropsContextProvider>
    </ActionStateContextProvider>
  );
});

export default ActionGroup;
