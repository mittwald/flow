import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./ButtonGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import {
  ClearPropsContext,
  dynamic,
  PropsContextProvider,
} from "@/lib/propsContext";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";

export interface ButtonGroupProps
  extends PropsWithChildren,
    FlowComponentProps<"ButtonGroup">,
    PropsWithClassName {}

export const ButtonGroup = flowComponent("ButtonGroup", (props) => {
  const { children, className, refProp: ref, ...rest } = props;

  const rootClassName = clsx(styles.buttonGroupContainer, className);

  const propsContext: PropsContext = {
    Button: {
      className: dynamic((p) =>
        clsx(
          styles.button,
          p.color === "secondary" ? styles.secondary : undefined,
        ),
      ),
    },
  };

  return (
    <ClearPropsContext>
      <div {...rest} className={rootClassName} ref={ref}>
        <div className={styles.buttonGroup} role="group">
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </div>
      </div>
    </ClearPropsContext>
  );
});

export default ButtonGroup;
