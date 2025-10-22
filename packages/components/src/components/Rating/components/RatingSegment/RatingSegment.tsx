import React, { type FC } from "react";
import clsx from "clsx";
import styles from "@/components/Rating/Rating.module.scss";
import { IconStar, IconStarFilled } from "@/components/Icon/components/icons";
import * as Aria from "react-aria-components";
import type { RatingProps } from "@/components/Rating";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../locales/*.locale.json";

interface Props {
  index: number;
  selectedValue: number;
  size: RatingProps["size"];
}
export const RatingSegment: FC<Props> = (props) => {
  const { index, selectedValue, size } = props;

  const value = index + 1;

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Aria.Radio
      aria-label={stringFormatter.format(`rating.${value}`)}
      value={value.toString()}
      className={clsx(
        styles.ratingSegment,
        value === selectedValue && styles.current,
      )}
    >
      <IconStarFilled aria-hidden size={size} className={styles.starFilled} />
      <IconStar aria-hidden size={size} className={styles.star} />
    </Aria.Radio>
  );
};
