import { flowComponent } from "@/lib/componentFactory/flowComponent";
import React, { type ReactNode, useRef, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/Icon/components/icons";
import styles from "./LightBoxGallery.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../locales/*.locale.json";
import Button from "@/components/Button";

export interface LightBoxGalleryProps extends PropsWithClassName {
  children: ReactNode[];
  defaultIndex?: number;
}

/** @flr-generate all */
export const LightBoxGallery = flowComponent("LightBoxGallery", (props) => {
  const { children, className, defaultIndex = 0 } = props;

  const [currentIndex, setIndex] = useState(defaultIndex);

  const count = React.Children.count(children);

  const paginate = (direction: number) => {
    setIndex((prev: number) => (prev + direction + count) % count);
  };

  const pointerStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;

    const distance = pointerStartX.current - e.clientX;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      paginate(distance > 0 ? 1 : -1);
    }

    pointerStartX.current = null;
  };

  const handlePointerCancel = () => {
    pointerStartX.current = null;
  };

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
    <div className={clsx(styles.gallery, className)}>
      <div
        className={styles.content}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className={styles.galleryItem} key={currentIndex}>
          {children[currentIndex]}
        </div>

        <div className={styles.controls}>
          <Button
            aria-label={stringFormatter.format("previous")}
            onPress={() => paginate(-1)}
            color="light-static"
            className={styles.previousButton}
          >
            <IconChevronLeft />
          </Button>
          <div
            className={styles.indicators}
            aria-label={stringFormatter.format("indicator", {
              current: currentIndex + 1,
              count,
            })}
          >
            {indicators}
          </div>
          <Button
            aria-label={stringFormatter.format("next")}
            onPress={() => paginate(1)}
            color="light-static"
            className={styles.nextButton}
          >
            <IconChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default LightBoxGallery;
