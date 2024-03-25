import React, { FC, PropsWithChildren } from "react";
import styles from "./Badge.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Wrap } from "@/components/Wrap";
import { Text } from "@/components/Text";

export interface BadgeProps extends PropsWithChildren {
  className?: string;
}

export const Badge: FC<BadgeProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.badge, className);

  const isStringContent = typeof children === "string";

  const propsContext: PropsContext = {
    Text: {
      className: styles.text,
    },
    Button: {
      className: styles.button,
      size: "s",
      variant: "secondary",
      style: "plain",
    },
  };

  return (
    <div className={rootClassName} {...rest}>
      <PropsContextProvider props={propsContext}>
        <Wrap if={isStringContent}>
          <Text>{children}</Text>
        </Wrap>
      </PropsContextProvider>
    </div>
  );
};

export default Badge;
