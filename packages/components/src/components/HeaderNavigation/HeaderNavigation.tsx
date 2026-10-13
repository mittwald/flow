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
import { containsTextChild } from "@/lib/react/remote";

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

  const buttonPropsContext = {
    className: styles.button,
    color: isAlphaColor(color) ? color : "secondary",
    variant: "plain",
  } as const;

  const propsContext: PropsContext = {
    Link: {
      wrapWith: <li className={styles.item} />,
      className: styles.link,
      unstyled: true,
      /**
       * `Text` clears the props context, so a link combined with a button must
       * not get it — the button would lose the context of `Link`.
       */
      children: dynamic((props) =>
        containsTextChild(props.children) ? (
          <Text emulateBoldWidth>{props.children}</Text>
        ) : (
          props.children
        ),
      ),
      Button: buttonPropsContext,
    },
    Button: {
      ...buttonPropsContext,
      wrapWith: <li className={styles.item} />,
    },
  };

  return (
    <nav className={rootClassName} role="navigation" {...rest}>
      <ul className={styles.list}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </ul>
    </nav>
  );
};

export default HeaderNavigation;
