import { flowComponent } from "@/lib/componentFactory/flowComponent";
import React, { type CSSProperties, type ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/Button";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/Icon/components/icons";
import styles from "./Gallery.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";

export interface GalleryProps {
  children: ReactNode[];
  height?: CSSProperties["height"];
}

export const Gallery = flowComponent("Gallery", (props) => {
  const { children, height = 400 } = props;

  const [[currentIndex, direction], setIndex] = useState([0, 0]);

  const count = React.Children.count(children);

  const paginate = (newDirection: number) => {
    setIndex(([prevIndex]) => {
      const nextIndex = (prevIndex + newDirection + count) % count;
      return [nextIndex, newDirection];
    });
  };

  const paginationDots = Array(count)
    .fill("")
    .map((_, index) => (
      <span
        key={index}
        className={clsx(
          styles.paginationDot,
          currentIndex === index && styles.current,
        )}
      />
    ));

  const propsContext: PropsContext = {
    GalleryItem: {
      height,
    },
  };

  return (
    <div className={styles.gallery} style={{ height }}>
      <PropsContextProvider props={propsContext}>
        <AnimatePresence custom={direction}>
          <motion.div
            className={styles.motion}
            key={currentIndex}
            custom={direction}
            variants={{
              enter: { opacity: 0 },
              center: { opacity: 1 },
              exit: { opacity: 0 },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x < -50 || velocity.x < -500) paginate(1);
              if (offset.x > 50 || velocity.x > 500) paginate(-1);
            }}
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>

        <div className={styles.paginationDots}>{paginationDots}</div>

        <Button onPress={() => paginate(-1)}>
          <IconChevronLeft />
        </Button>

        <Button onPress={() => paginate(1)}>
          <IconChevronRight />
        </Button>
      </PropsContextProvider>
    </div>
  );
});

export default Gallery;
