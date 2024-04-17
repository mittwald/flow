import type { ComponentProps, FC, PropsWithChildren } from "react";
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

export interface ButtonGroupProps
  extends PropsWithChildren<ComponentProps<"div">> {}

export const ButtonGroup: FC<ButtonGroupProps> = (props) => {
  const { children, className, ...rest } = useProps("ButtonGroup", props);

  const rootClassName = clsx(styles.buttonGroup, className);

  const propsContext: PropsContext = {
    Button: {
      className: dynamic((p) =>
        p.variant === "secondary" ? styles.secondary : undefined,
      ),
    },
  };

  return (
    <ClearPropsContext>
      <div className={styles.buttonGroupContainer}>
        <div {...rest} className={rootClassName} role="group">
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </div>
      </div>
    </ClearPropsContext>
  );
};

export default ButtonGroup;
