import React, { type FC } from "react";
import clsx from "clsx";
import styles from "@/components/Rating/Rating.module.scss";
import * as Aria from "react-aria-components";
import type { RatingProps } from "@/components/Rating";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../locales/*.locale.json";
import { RatingStar } from "@/components/Rating/components/RatingSegment/RatingStar";
import { RatingStarFilled } from "@/components/Rating/components/RatingSegment/RatingStarFilled";

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
      <RatingStarFilled size={size} />
      <RatingStar size={size} />
    </Aria.Radio>
  );
};
