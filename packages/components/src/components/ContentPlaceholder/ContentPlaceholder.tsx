import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./ContentPlaceholder.module.css";
import clsx from "clsx";
import { StatusVariantProps } from "@/lib/types/props";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface ContentPlaceholderProps
  extends PropsWithChildren<ComponentProps<"div">>,
    StatusVariantProps<"success" | "warning"> {}

export const ContentPlaceholder: FC<ContentPlaceholderProps> = (props) => {
  const { className, children, variant = "info", ...rest } = props;

  const rootClassName = clsx(className, styles.root, styles[variant]);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
    },
    Heading: {
      className: styles.heading,
    },
    Text: {
      className: styles.text,
    },
    Button: {
      className: styles.button,
    },
  };

  return (
    <div {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default ContentPlaceholder;
