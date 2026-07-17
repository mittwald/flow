import type { PropsWithChildren } from "react";
import styles from "./ActionGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { ActionStateContextProvider } from "@/components/Action/models/ActionStateContext";
import { getActionGroupSlot } from "@/components/ActionGroup/lib/getActionGroupSlot";
import type { ButtonProps } from "@/components/Button";

export interface ActionGroupProps
  extends
    PropsWithChildren,
    FlowComponentProps<HTMLDivElement>,
    PropsWithClassName {
  /** The spacing between the buttons inside the action group. @default "s" */
  spacing?: "s" | "m";
  /** The size of the buttons and links inside the action group. @default "m" */
  size?: ButtonProps["size"];
  /**
   * When set, the buttons are not sorted automatically but stay in source
   * order. @default false
   */
  preserveOrder?: boolean;
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
      size,
      preserveOrder = false,
      ...rest
    } = props;

    const rootClassName = clsx(
      styles.actionGroup,
      styles[spacing],
      !preserveOrder && styles.sorted,
      className,
    );

    const propsContext: PropsContext = preserveOrder
      ? {
          Button: { size },
          Switch: {
            labelPosition: "leading",
          },
          Link: { size },
        }
      : {
          Button: {
            size,
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
            size,
            className: dynamic((props) => {
              return clsx(props.className, props.slot && styles[props.slot]);
            }),
          },
        };

    return (
      <ActionStateContextProvider>
        <PropsContextProvider
          props={propsContext}
          dependencies={[preserveOrder, size]}
        >
          <div {...rest} className={rootClassName} ref={ref} role="group">
            {children}
          </div>
        </PropsContextProvider>
      </ActionStateContextProvider>
    );
  },
  {
    type: "layout",
  },
);

export default ActionGroup;
