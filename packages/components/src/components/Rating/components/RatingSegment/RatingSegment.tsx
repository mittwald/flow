import { type FC, type PropsWithChildren, type ReactElement } from "react";
import clsx from "clsx";
import styles from "@/components/Rating/Rating.module.scss";
import * as Aria from "react-aria-components";
import type { RatingProps } from "@/components/Rating";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../locales/*.locale.json";
import { FilledSegment } from "@/components/Rating/components/RatingSegment/FilledSegment";
import { EmptySegment } from "@/components/Rating/components/RatingSegment/EmptySegment";

interface Props extends PropsWithChildren {
  index: number;
  selectedValue: number;
  size: RatingProps["size"];
  iconEmpty?: ReactElement;
  iconFilled?: ReactElement;
}
export const RatingSegment: FC<Props> = (props) => {
  const { index, selectedValue, size, iconEmpty, iconFilled } = props;

  const value = index + 1;

  const stringFormatter = useLocalizedStringFormatter(locales, "Rating");

  return (
    <Aria.Radio
      aria-label={stringFormatter.format(`segment.${value}`)}
      value={value.toString()}
      className={clsx(
        styles.ratingSegment,
        value === selectedValue && styles.current,
      )}
    >
      <FilledSegment size={size}>{iconFilled}</FilledSegment>
      <EmptySegment size={size}>{iconEmpty}</EmptySegment>
    </Aria.Radio>
  );
};
