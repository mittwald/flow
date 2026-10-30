import type { CSSProperties, PropsWithChildren } from "react";
import {
  type AlphaColor,
  decorativeColors,
  deprecatedDecorativeColors,
  type DeprecatedDecorativeColor,
  type PropsWithClassName,
  type PropsWithElementType,
} from "@/lib/types/props";
import clsx from "clsx";
import styles from "./AccentBox.module.scss";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { SectionHeadingReset } from "@/components/Section/context";
import { useDeprecatedColor } from "@/lib/hooks/useDeprecatedColor";
import { styleClassname } from "@/lib/scss/selectors";

/** The brand gradients, one per decorative color (#3456). */
const accentBoxGradients = [
  "gradient-navy",
  "gradient-sage",
  "gradient-lilac",
  "gradient-salmon",
] as const;

/**
 * Deprecated background colors and the value each renders as (#3456).
 * `gradient` was the only gradient; navy is the standard one now. `green`
 * rendered the success mint; AccentBox is decorative, so it takes the brand's
 * green.
 */
const deprecatedBackgroundColors = {
  ...deprecatedDecorativeColors,
  gradient: "gradient-navy",
  green: "sage",
} as const;

const accentBoxBackgroundColors = [
  "neutral",
  ...decorativeColors,
  ...accentBoxGradients,
  // deprecated (#3456)
  ...(Object.keys(deprecatedDecorativeColors) as DeprecatedDecorativeColor[]),
  "gradient",
  "green",
] as const;

/** Colored surfaces, where content defaults to `dark` (#3456). */
const decorativeBackgroundColors: readonly string[] = [
  ...decorativeColors,
  ...accentBoxGradients,
];

type AccentBoxBackgroundColor = (typeof accentBoxBackgroundColors)[number];
type AccentBoxWithCustomBackgroundColor =
  AccentBoxBackgroundColor | (string & {});

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
  /**
   * The background color of the accent box. Besides the Flow colors, any custom
   * CSS color is supported.
   *
   * @default "neutral"
   * @deprecatedValues violet, teal, green, gradient
   */
  backgroundColor?: AccentBoxWithCustomBackgroundColor;
  /**
   * The content color of the accent box. Defaults to `dark` on the decorative
   * colors and the gradients, otherwise to `default`.
   */
  color?: "default" | AlphaColor;
  /** The background image of the accent box. */
  backgroundImage?: string;
  /** The aspect ratio of the accent box. */
  aspectRatio?: CSSProperties["aspectRatio"];
}

/**
 * @flr-generate all
 * @flowStatus beta
 */
export const AccentBox = flowComponent("AccentBox", (props) => {
  const {
    color: colorFromProps,
    backgroundColor: backgroundColorFromProps = "neutral",
    backgroundImage,
    children,
    elementType = "div",
    className,
    style: styleFromProps,
    aspectRatio,
  } = props;

  // backwards compatibility
  const backgroundColorFromColor =
    (colorFromProps as unknown as string) === "neutral" ||
    (colorFromProps as unknown as string) === "gradient" ||
    (colorFromProps as unknown as string) === "green"
      ? (colorFromProps as unknown as AccentBoxBackgroundColor)
      : undefined;

  const backgroundColor =
    useDeprecatedColor(
      backgroundColorFromColor ?? backgroundColorFromProps,
      deprecatedBackgroundColors,
    ) ?? "neutral";

  const isAFlowColor = isFlowColor(backgroundColor);

  const defaultColor = decorativeBackgroundColors.includes(backgroundColor)
    ? "dark"
    : "default";

  const color = backgroundColorFromColor
    ? defaultColor
    : (colorFromProps ?? defaultColor);

  const style = {
    backgroundColor: isAFlowColor ? undefined : backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    aspectRatio,
    ...styleFromProps,
  };

  const rootClassName = clsx(
    styles.accentBox,
    isAFlowColor && styleClassname(styles, backgroundColor),
    className,
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
      <SectionHeadingReset>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </SectionHeadingReset>
    </Element>
  );
});

export default AccentBox;
