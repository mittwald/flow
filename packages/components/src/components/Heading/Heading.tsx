import React from "react";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";

export interface HeadingProps extends Aria.HeadingProps, FlowComponentProps {}

export const Heading = flowComponent("Heading", (props) => {
  const { children, className, level = 2, ref, ...rest } = props;

  const rootClassName = clsx(styles.heading, className);

  const propsContext: PropsContext = {
    Icon: {
      "aria-hidden": true,
      size: "s",
      className: styles.icon,
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
