import type { ComponentProps, PropsWithChildren } from "react";
import styles from "./IllustratedMessage.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { type AlphaColor, isAlphaColor } from "@/lib/types/props";

export interface IllustratedMessageProps
  extends PropsWithChildren<ComponentProps<"div">>, FlowComponentProps {
  /** The color of the illustrated message. @default "primary" */
  color?: "primary" | "danger" | "unavailable" | AlphaColor;
}

/** @flr-generate all */
export const IllustratedMessage = flowComponent(
  "IllustratedMessage",
  (props) => {
    const { className, children, color = "primary", ...rest } = props;

    const rootClassName = clsx(
      styles.illustratedMessage,
      className,
      styles[color],
    );

    const alphaColor = isAlphaColor(color) ? color : undefined;

    const propsContext: PropsContext = {
      Icon: {
        className: styles.icon,
        size: "l",
      },
      Heading: {
        className: styles.heading,
        color,
      },
      Text: {
        className: styles.text,
        color: alphaColor,
      },
      Button: {
        color: alphaColor ?? "accent",
      },
      ActionGroup: {
        className: styles.actionGroup,
      },
      ProgressBar: { className: styles.progressBar },
    };

    return (
      <div {...rest} className={rootClassName}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    );
  },
);

export default IllustratedMessage;
