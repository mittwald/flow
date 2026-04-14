import type { CSSProperties, PropsWithChildren } from "react";
import type {
  AlphaColor,
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import clsx from "clsx";
import styles from "./AccentBox.module.scss";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";

const accentBoxBackgroundColors = [
  "neutral",
  "blue",
  "violet",
  "teal",
  "lilac",
  "green",
  "navy",
  "gradient",
] as const;

type AccentBoxBackgroundColor = (typeof accentBoxBackgroundColors)[number];
type AccentBoxWithCustomBackgroundColor =
  | AccentBoxBackgroundColor
  | (string & {});

function isFlowColor(
  something: unknown,
): something is AccentBoxBackgroundColor {
  const anyAccentBoxBackgroundColors =
    accentBoxBackgroundColors as readonly string[];
  return (
    typeof something === "string" &&
    anyAccentBoxBackgroundColors.includes(something)
  );
}

export interface AccentBoxProps
  extends
    PropsWithChildren,
    PropsWithElementType<"div" | "section" | "article">,
    PropsWithClassName,
    FlowComponentProps {
  /** The background color of the accent box. @default "blue" */
  backgroundColor?: AccentBoxWithCustomBackgroundColor;
  /** The content color of the accent box. @default "default" */
  color?: "default" | AlphaColor;
  /** The background image of the accent box. */
  backgroundImage?: string;
  /** The aspect ratio of the accent box. */
  aspectRatio?: CSSProperties["aspectRatio"];
}

/** @flr-generate all */
export const AccentBox = flowComponent("AccentBox", (props) => {
  const {
    color = "default",
    backgroundColor = "blue",
    backgroundImage,
    children,
    elementType = "div",
    className,
    style: styleFromProps,
    aspectRatio,
  } = props;

  const isAFlowColor = isFlowColor(backgroundColor);

  // backwards compatibility
  const backgroundColorFromColor =
    (color as unknown as string) === "neutral" ||
    (color as unknown as string) === "gradient" ||
    (color as unknown as string) === "green"
      ? (color as unknown as AccentBoxBackgroundColor)
      : undefined;

  const style = {
    backgroundColor: isAFlowColor ? undefined : backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    aspectRatio,
    ...styleFromProps,
  };

  const rootClassName = clsx(
    styles.accentBox,
    className,
    backgroundColorFromColor
      ? styles[backgroundColorFromColor]
      : isAFlowColor
        ? styles[backgroundColor]
        : undefined,
  );

  const Element = elementType;

  const contentColor = color === "default" ? undefined : color;

  const propsContext: PropsContext = {
    Link: {
      color: contentColor,
    },
    Text: {
      color: contentColor,
    },
    Heading: {
      color: contentColor,
    },
    Icon: {
      className: styles.icon,
    },
  };

  return (
    <Element className={rootClassName} style={style}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Element>
  );
});

export default AccentBox;
