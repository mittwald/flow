import type { FC, PropsWithChildren } from "react";
import styles from "./Color.module.scss";

export interface ColorProps extends PropsWithChildren {
  /** The color of the element. @default "blue" */
  color?: "blue" | "violet" | "teal" | "lilac";
}

/** @flr-generate all */

export const Color: FC<ColorProps> = (props) => {
  const { children, color = "blue" } = props;

  return <span className={color ? styles[color] : undefined}>{children}</span>;
};

export default Color;
