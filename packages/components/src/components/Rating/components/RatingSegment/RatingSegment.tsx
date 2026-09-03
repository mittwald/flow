import { type ReactElement } from "react";
import clsx from "clsx";
import styles from "@/components/Rating/Rating.module.scss";
import * as Aria from "react-aria-components";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../locales/*.locale.json";
import { useRatingSegmentContext } from "@/components/Rating/context";
import { FilledSegment } from "@/components/Rating/components/RatingSegment/FilledSegment";
import { EmptySegment } from "@/components/Rating/components/RatingSegment/EmptySegment";

export interface RatingSegmentProps
  extends
    Omit<Aria.RadioProps, "children" | "value" | "className">,
    PropsWithClassName,
    FlowComponentProps<HTMLLabelElement> {
  /** An alternative icon for the empty state of this segment */
  iconEmpty?: ReactElement;
  /** An alternative icon for the filled state of this segment */
  iconFilled?: ReactElement;
  /** @internal Set by the surrounding `Rating`. */
  size?: "s" | "m";
  /** A segment renders icons only. `never` keeps the shared props union usable. */
  children?: never;
}

/**
 * @flr-generate all
 * @flr-slot-props iconEmpty, iconFilled
 */
export const RatingSegment = flowComponent("RatingSegment", (props) => {
  const { className, iconEmpty, iconFilled, size = "m", ref, ...rest } = props;

  const { value, count } = useRatingSegmentContext();

  const stringFormatter = useLocalizedStringFormatter(locales, "Rating");

  return (
    <Aria.Radio
      aria-label={stringFormatter.format("segment", { value, count })}
      {...rest}
      value={value.toString()}
      ref={ref}
      className={({ isSelected }) =>
        clsx(styles.ratingSegment, isSelected && styles.current, className)
      }
    >
      <FilledSegment size={size}>{iconFilled}</FilledSegment>
      <EmptySegment size={size}>{iconEmpty}</EmptySegment>
    </Aria.Radio>
  );
});

export default RatingSegment;
