import type { FC } from "react";
import styles from "@/components/LightBox/components/LightBoxGallery/LightBoxGallery.module.scss";
import clsx from "clsx";
import { useLocalizedStringFormatter } from "react-aria";
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
