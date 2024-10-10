import React from "react";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";

export interface HeadingProps extends Aria.HeadingProps, FlowComponentProps {
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
  /** @default "primary" */
  color?: "primary" | "dark" | "light";
}

export const Heading = flowComponent("Heading", (props) => {
  const {
    children,
    className,
    level = 2,
    color = "primary",
    size,
    refProp: ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.heading,
    size && styles[size],
    styles[color],
    className,
  );

  const propsContext: PropsContext = {
    Icon: {
      "aria-hidden": true,
      className: styles.icon,
    },
    AlertBadge: {
      wrapWith: <div className={styles.headingContent} />,
    },
  };

  return (
    <ClearPropsContext>
      <Aria.Heading level={level} className={rootClassName} {...rest} ref={ref}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Aria.Heading>
    </ClearPropsContext>
  );
});

export default Heading;
