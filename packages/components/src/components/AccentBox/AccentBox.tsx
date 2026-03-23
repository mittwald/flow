import type { PropsWithChildren } from "react";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import clsx from "clsx";
import styles from "./AccentBox.module.scss";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

const accentBoxColors = ["blue", "green", "neutral"] as const;

type AccentBoxColor = (typeof accentBoxColors)[number];
type AccentBoxWithCustomColor = AccentBoxColor | (string & {});

function isAccentBoxColor(something: unknown): something is AccentBoxColor {
  const anyAccentBoxColors = accentBoxColors as readonly string[];
  return (
    typeof something === "string" && anyAccentBoxColors.includes(something)
  );
}

export interface AccentBoxProps
  extends
    PropsWithChildren,
    PropsWithElementType<"div" | "section" | "article">,
    PropsWithClassName,
    FlowComponentProps {
  /** The background color of the accent box. @default "neutral" */
  color?: AccentBoxWithCustomColor;
}

/** @flr-generate all */
export const AccentBox = flowComponent(
  "AccentBox",
  (props) => {
    const {
      color = "neutral",
      children,
      elementType = "div",
      className,
    } = props;

    const accentBoxColor = isAccentBoxColor(color);

    const rootClassName = clsx(
      styles.accentBox,
      className,
      accentBoxColor && styles[color],
    );

    const Element = elementType;

    return (
      <Element
        className={rootClassName}
        style={{ backgroundColor: accentBoxColor ? undefined : color }}
      >
        {children}
      </Element>
    );
  },
  { type: "layout" },
);

export default AccentBox;
