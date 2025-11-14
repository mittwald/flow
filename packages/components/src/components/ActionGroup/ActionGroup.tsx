import type { PropsWithChildren } from "react";
import styles from "./ActionGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelProvider } from "@mittwald/react-tunnel";
import { ActionStateContextProvider } from "@/components/Action/models/ActionStateContext";
import { getActionGroupSlot } from "@/components/ActionGroup/lib/getActionGroupSlot";

export interface ActionGroupProps
  extends PropsWithChildren,
    FlowComponentProps<HTMLDivElement>,
    PropsWithClassName {
  /** The spacing between the buttons inside the action group. @default "m" */
  spacing?: "s" | "m";
}

/** @flr-generate all */
export const ActionGroup = flowComponent(
  "ActionGroup",
  (props) => {
    const {
      children,
      className,
      ref,

      spacing = "s",
      ...rest
    } = props;

    const rootClassName = clsx(styles.actionGroup, className, styles[spacing]);

    const propsContext: PropsContext = {
      Button: {
        slot: dynamic((props) => getActionGroupSlot(props)),
        className: dynamic((props) => {
          const slot = getActionGroupSlot(props);
          return clsx(props.className, styles[slot]);
        }),
      },
      Switch: {
        labelPosition: "leading",
        className: dynamic((props) => {
          return clsx(props.className, props.slot && styles[props.slot]);
        }),
      },
      Link: {
        className: dynamic((props) => {
          return clsx(props.className, props.slot && styles[props.slot]);
        }),
      },
    };

    return (
      <ActionStateContextProvider>
        <PropsContextProvider props={propsContext}>
          <TunnelProvider>
            <div {...rest} className={rootClassName} ref={ref} role="group">
              {children}
            </div>
          </TunnelProvider>
        </PropsContextProvider>
      </ActionStateContextProvider>
    );
  },
  {
    type: "layout",
  },
);

export default ActionGroup;
