import { flowComponent } from "@/lib/componentFactory/flowComponent";
import React, { type CSSProperties, type ReactNode, useState } from "react";
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

export interface GalleryProps extends PropsWithClassName {
  children: ReactNode[];
  height?: CSSProperties["height"];
}

export const Gallery = flowComponent("Gallery", (props) => {
  const { children, height = 400, className } = props;

  const [currentIndex, setIndex] = useState(0);

  const count = React.Children.count(children);

  const paginate = (newDirection: number) => {
    setIndex((prevIndex) => {
      return (prevIndex + newDirection + count) % count;
    });
  };

  const paginationDots = Array(count)
    .fill("")
    .map((_, index) => (
      <Color color="light">
        <Icon key={index}>
          {currentIndex === index ? <IconCircle /> : <IconCircleFilled />}
        </Icon>
      </Color>
    ));

  return (
    <div className={clsx(styles.gallery, className)}>
      <Button onPress={() => paginate(-1)} color="light">
        <IconChevronLeft />
      </Button>

      <div className={styles.content} style={{ height }}>
        {children[currentIndex]}
        <div className={styles.paginationDots}>{paginationDots}</div>
      </div>

      <Button onPress={() => paginate(1)} color="light">
        <IconChevronRight />
      </Button>
    </div>
  );
});

export default Gallery;
