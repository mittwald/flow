import { flowComponent } from "@/lib/componentFactory/flowComponent";
import React, { type ReactNode, useState } from "react";
import { Button } from "@/components/Button";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/Icon/components/icons";
import styles from "./Gallery.module.scss";
import { IconCircle, IconCircleFilled } from "@tabler/icons-react";
import { Icon } from "@/components/Icon";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { Color } from "@/components/Color";
import ButtonView from "@/views/ButtonView";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";

export interface GalleryProps extends PropsWithClassName {
  children: ReactNode[];
  defaultIndex?: number;
}

export const Gallery = flowComponent("Gallery", (props) => {
  const { children, className, defaultIndex = 0 } = props;

  const [currentIndex, setIndex] = useState(defaultIndex);

  const count = React.Children.count(children);

  const paginate = (newDirection: number) => {
    setIndex((prevIndex) => {
      return (prevIndex + newDirection + count) % count;
    });
  };

  const stringFormatter = useLocalizedStringFormatter(locales);

  const indicators = Array(count)
    .fill("")
    .map((_, index) => (
      <Color color="light">
        <Icon className={styles.indicator} key={index} size="s" aria-hidden>
          {currentIndex === index ? <IconCircleFilled /> : <IconCircle />}
        </Icon>
      </Color>
    ));

  return (
    <div className={clsx(styles.gallery, className)}>
      <ButtonView
        aria-label={stringFormatter.format("gallery.previous")}
        onPress={() => paginate(-1)}
        color="light"
      >
        <IconChevronLeft />
      </ButtonView>

      <div className={styles.content}>
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
      >
        <IconChevronRight />
      </Button>
    </div>
  );
});

export default Gallery;
