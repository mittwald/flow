import type { FC } from "react";
import styles from "@/components/LightBox/components/LightBoxGallery/LightBoxGallery.module.scss";
import clsx from "clsx";
/*
 * Flow's own formatter, not react-aria's: the indicator's message takes
 * variables, and only this one runs them through IntlMessageFormat –
 * react-aria's hands back the raw "{current} of {count}".
 */
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../../locales/*.locale.json";

interface Props {
  count: number;
  currentIndex: number;
}

export const Controls: FC<Props> = (props) => {
  const { count, currentIndex } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "LightBox");

  const indicators = Array(count)
    .fill("")
    .map((_, index) => (
      <span
        key={index}
        className={clsx(
          styles.indicator,
          currentIndex === index && styles.current,
        )}
      />
    ));

  return (
    <div
      className={styles.indicators}
      aria-label={stringFormatter.format("indicator", {
        current: currentIndex + 1,
        count,
      })}
    >
      {indicators}
    </div>
  );
};
