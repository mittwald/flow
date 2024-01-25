import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./Section.module.scss";
import clsx from "clsx";

export interface SectionProps
  extends PropsWithChildren<ComponentProps<"section">> {}

export const Section: FC<SectionProps> = (props) => {
  const { children, className, ...rest } = props;

  if (!children) {
    return null;
  }

  const rootClassName = clsx(styles.section, className);

  return (
    <section {...rest} className={rootClassName}>
      {children}
    </section>
  );
};

export default Section;
