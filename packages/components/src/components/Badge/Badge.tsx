import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Badge.module.scss";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PressEvent } from "@react-types/shared";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";

export interface BadgeProps
  extends PropsWithChildren,
    FlowComponentProps,
    PropsWithClassName {
  onPress?: (e: PressEvent) => void;
  onClose?: (e: PressEvent) => void;
  color?:
    | "neutral"
    | "blue"
    | "navy"
    | "violet"
    | "teal"
    | "lilac"
    | "green"
    | "orange"
    | "red"
    | "dark"
    | "light";
  isDisabled?: boolean;
}

export const Badge = flowComponent("Badge", (props) => {
  const {
    children,
    className,
    color = "neutral",
    refProp: ref,
    onPress,
    onClose,
    isDisabled,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.badge,
    styles[color],
    isDisabled && styles.disabled,
    className,
  );

  const propsContext: PropsContext = {
    Label: {
      elementType: "span",
      className: styles.scope,
      unstyled: true,
    },
    Text: {
      elementType: "span",
      className: styles.value,
    },
    Button: {
      Label: {
        elementType: "span",
        className: styles.scope,
        unstyled: true,
      },
      Text: {
        elementType: "span",
        className: styles.value,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <div className={rootClassName} {...rest} ref={ref}>
        {!onPress && <div className={styles.content}>{children}</div>}
        {onPress && (
          <Button
            isDisabled={isDisabled}
            unstyled
            className={styles.button}
            onPress={onPress}
          >
            {children}
          </Button>
        )}
        {onClose && (
          <Button
            className={styles.close}
            size="s"
            color="dark"
            variant="plain"
            onPress={onClose}
            isDisabled={isDisabled}
          >
            <IconClose />
          </Button>
        )}
      </div>
    </PropsContextProvider>
  );
});

export default Badge;
