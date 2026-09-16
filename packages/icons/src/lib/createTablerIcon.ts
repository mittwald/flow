/**
 * Runtime for the inlined Tabler icons in `../components`. Adapted from
 * `createReactComponent` and `defaultAttributes` of `@tabler/icons-react`.
 *
 * Tabler Icons — MIT License, Copyright (c) 2020-2026 Paweł Kuna. See the
 * LICENSE file in the root of this package.
 */
import {
  createElement,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";

export type TablerIconType = "outline" | "filled";

/** A single SVG child of an icon: tag name plus its attributes. */
export type TablerIconNode = [
  tag: string,
  attributes: Record<string, string | number>,
][];

export interface TablerIconProps extends Omit<
  ComponentPropsWithRef<"svg">,
  "stroke"
> {
  size?: string | number;
  stroke?: string | number;
  title?: string;
}

const defaultAttributes: Record<
  TablerIconType,
  ComponentPropsWithRef<"svg">
> = {
  outline: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  filled: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: "none",
  },
};

export const createTablerIcon = (
  type: TablerIconType,
  iconName: string,
  iconNamePascal: string,
  iconNode: TablerIconNode,
) => {
  const Component = (props: TablerIconProps): ReactNode => {
    const {
      color = "currentColor",
      size = 24,
      stroke = 2,
      title,
      className,
      children,
      ...rest
    } = props;

    return createElement(
      "svg",
      {
        ...defaultAttributes[type],
        width: size,
        height: size,
        className: ["tabler-icon", `tabler-icon-${iconName}`, className].join(
          " ",
        ),
        ...(type === "filled"
          ? { fill: color }
          : { strokeWidth: stroke, stroke: color }),
        ...rest,
      },
      [
        title && createElement("title", { key: "svg-title" }, title),
        ...iconNode.map(([tag, attributes], index) =>
          createElement(tag, { ...attributes, key: `svg-${index}` }),
        ),
        ...(Array.isArray(children) ? children : [children]),
      ],
    );
  };

  Component.displayName = iconNamePascal;

  return Component;
};
