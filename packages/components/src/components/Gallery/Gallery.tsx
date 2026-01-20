import { flowComponent } from "@/lib/componentFactory/flowComponent";
import React, { type ReactNode, useRef, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/Icon/components/icons";
import styles from "./Gallery.module.scss";
import { IconCircle, IconCircleFilled } from "@tabler/icons-react";
import { Icon } from "@/components/Icon";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import Button from "@/components/Button";

export interface GalleryProps extends PropsWithClassName {
  children: ReactNode[];
  defaultIndex?: number;
}

/** @flr-generate all */
export const Gallery = flowComponent("Gallery", (props) => {
  const { children, className, defaultIndex = 0 } = props;

  const [currentIndex, setIndex] = useState(defaultIndex);

  const count = React.Children.count(children);

  const paginate = (direction: number) => {
    setIndex((prev) => (prev + direction + count) % count);
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

  const stringFormatter = useLocalizedStringFormatter(locales);

  const indicators = Array(count)
    .fill("")
    .map((_, index) => (
      <Icon key={index} className={styles.indicator} size="s" aria-hidden>
        {currentIndex === index ? <IconCircleFilled /> : <IconCircle />}
      </Icon>
    ));

  return (
    <div className={clsx(styles.gallery, className)}>
      <Button
        aria-label={stringFormatter.format("gallery.previous")}
        onPress={() => paginate(-1)}
        color="light"
        className={styles.prev}
      >
        <IconChevronLeft />
      </Button>

      <div
        className={styles.content}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className={styles.galleryItem} key={currentIndex}>
          {children[currentIndex]}
        </div>

        <div
          className={styles.indicators}
          aria-label={stringFormatter.format("gallery.indicator", {
            current: currentIndex + 1,
            count,
          })}
        >
          {indicators}
        </div>
      </div>

      <Button
        aria-label={stringFormatter.format("gallery.next")}
        onPress={() => paginate(1)}
        color="light"
        className={styles.next}
      >
        <IconChevronRight />
      </Button>
    </div>
  );
});

export default Gallery;
