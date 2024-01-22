import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./Section.module.css";
import clsx from "clsx";

export interface SectionProps
  extends PropsWithChildren<ComponentProps<"section">> {}

export const Section: FC<SectionProps> = (props) => {
  const { children, className, ...rest } = props;

  if (!children) {
    return null;
  }

  const rootClassName = clsx(className, styles.root);

  return (
    <section {...rest} className={rootClassName}>
      {children}
    </section>
  );
};

export default Section;
