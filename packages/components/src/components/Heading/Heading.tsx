import React, { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import {
  ClearPropsContext,
  PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends PropsWithChildren,
    ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">,
    FlowComponentProps {
  level?: Level;
  tunnelId?: string;
}

export const Heading = flowComponent("Heading", (props) => {
  const { children, className, level = 2, ...rest } = props;

  const rootClassName = clsx(styles.heading, className);

  const Element: `h${Level}` = `h${level}`;

  const propsContext: PropsContext = {
    Icon: {
      "aria-hidden": true,
      size: "s",
      className: styles.icon,
    },
  };

  return (
    <ClearPropsContext>
      <Element className={rootClassName} {...rest}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Element>
    </ClearPropsContext>
  );
});

export default Heading;
