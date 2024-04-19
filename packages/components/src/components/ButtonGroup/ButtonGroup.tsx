import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";
import styles from "./ButtonGroup.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import {
  ClearPropsContext,
  dynamic,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ButtonGroupProps
  extends PropsWithChildren<ComponentProps<"div">>,
    FlowComponentProps {}

export const ButtonGroup = flowComponent("ButtonGroup", (props) => {
  const { children, className, ...rest } = useProps("ButtonGroup", props);

  const rootClassName = clsx(styles.buttonGroupContainer, className);

  const propsContext: PropsContext = {
    Button: {
      className: dynamic((p) =>
        p.variant === "secondary" ? styles.secondary : undefined,
      ),
    },
  };

  return (
    <ClearPropsContext>
      <div {...rest} className={rootClassName}>
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
