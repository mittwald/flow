import type { ComponentProps, FC, PropsWithChildren } from "react";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import clsx from "clsx";
import styles from "./HeaderNavigation.module.scss";
import {
  type AlphaColor,
  isAlphaColor,
  type PropsWithClassName,
} from "@/lib/types/props";
import { Text } from "@/components/Text";

export interface HeaderNavigationProps
  extends PropsWithChildren<ComponentProps<"nav">>, PropsWithClassName {
  /** The color of the header navigation. @default "default" */
  color?: "default" | AlphaColor;
}

/** @flr-generate all */
export const HeaderNavigation: FC<HeaderNavigationProps> = (props) => {
  const { children, className, color = "default", ...rest } = props;

  const rootClassName = clsx(
    styles.headerNavigation,
    isAlphaColor(color) && styles[color],
    className,
  );

  const propsContext: PropsContext = {
    Link: {
      wrapWith: <li />,
      className: styles.link,
      unstyled: true,
      children: dynamic((props) => (
        <Text emulateBoldWidth>{props.children}</Text>
      )),
    },
    Button: {
      className: styles.button,
      color: isAlphaColor(color) ? color : "secondary",
      variant: "plain",
      wrapWith: <li />,
    },
  };

  return (
    <nav className={rootClassName} role="navigation" {...rest}>
      <ul>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </ul>
    </nav>
  );
};

export default HeaderNavigation;
