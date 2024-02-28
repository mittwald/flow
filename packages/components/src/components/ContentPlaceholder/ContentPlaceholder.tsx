import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./ContentPlaceholder.module.scss";
import clsx from "clsx";
import { PropsWithVariant } from "@/lib/types/props";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface ContentPlaceholderProps
  extends PropsWithChildren<ComponentProps<"div">>,
    PropsWithVariant<"info" | "danger"> {}

export const ContentPlaceholder: FC<ContentPlaceholderProps> = (props) => {
  const { className, children, variant = "info", ...rest } = props;

  const rootClassName = clsx(
    styles.ContentPlaceholder,
    styles[variant],
    className,
  );

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
