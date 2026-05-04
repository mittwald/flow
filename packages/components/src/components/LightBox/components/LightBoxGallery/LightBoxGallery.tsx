import { flowComponent } from "@/lib/componentFactory/flowComponent";
import React, { type ReactNode, useEffect, useRef, useState } from "react";
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
import { Controls } from "@/components/LightBox/components/LightBoxGallery/Controls";

export interface LightBoxGalleryProps extends PropsWithClassName {
  children: ReactNode[];
  defaultIndex?: number;
}

/** @flr-generate all */
export const LightBoxGallery = flowComponent("LightBoxGallery", (props) => {
  const { children, className, defaultIndex = 0 } = props;

  const [currentIndex, setIndex] = useState(defaultIndex);

  const count = React.Children.count(children);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === count - 1;

  const pointerStartX = useRef<number | null>(null);
  const swipeThreshold = 50;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [containerRef.current]);

  const paginate = (direction: number) => {
    setIndex((prev) => {
      const next = prev + direction;

      if (next < 0) return 0;
      if (next >= count) return count - 1;

      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;

    const distance = pointerStartX.current - e.clientX;

    if (Math.abs(distance) > swipeThreshold) {
      paginate(distance > 0 ? 1 : -1);
    }

    pointerStartX.current = null;
  };

  const handlePointerCancel = () => {
    pointerStartX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        if (!isFirst) paginate(-1);
        break;
      case "ArrowRight":
        if (!isLast) paginate(1);
        break;
    }
  };

  const stringFormatter = useLocalizedStringFormatter(locales, "LightBox");

  return (
    <div className={clsx(styles.gallery, className)}>
      <div
        ref={containerRef}
        className={styles.content}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="region"
        aria-roledescription="carousel"
        aria-label={stringFormatter.format("gallery")}
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
            isDisabled={isFirst}
          >
            <IconChevronLeft />
          </Button>

          <Controls count={count} currentIndex={currentIndex} />

          <Button
            aria-label={stringFormatter.format("next")}
            onPress={() => paginate(1)}
            color="light-static"
            className={styles.nextButton}
            isDisabled={isLast}
          >
            <IconChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default LightBoxGallery;
