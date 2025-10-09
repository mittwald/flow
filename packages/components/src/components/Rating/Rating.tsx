import React, { type FC } from "react";
import { IconStar, IconStarFilled } from "@/components/Icon/components/icons";
import styles from "./Rating.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";

export interface RatingProps extends PropsWithClassName {
  /** The value sets the amount of filled stars. @default: 0 */
  value?: 0 | 1 | 2 | 3 | 4 | 5;
  /** The size of the component. @default: "m" */
  size?: "s" | "m";
}

/** @flr-generate all */
export const Rating: FC<RatingProps> = (props) => {
  const { value = 0, size = "m" } = props;

  const rootClassName = clsx(styles.rating, styles[`size-${size}`]);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const stars = Array(5)
    .fill("")
    .map((_, index) =>
      index < value ? (
        <IconStarFilled
          key={index}
          aria-hidden
          size={size}
          className={styles.starFilled}
        />
      ) : (
        <IconStar key={index} aria-hidden size={size} className={styles.star} />
      ),
    );

  return (
    <div
      aria-label={stringFormatter.format(`rating.${value}`)}
      className={rootClassName}
    >
      {stars}
    </div>
  );
};

export default Rating;
