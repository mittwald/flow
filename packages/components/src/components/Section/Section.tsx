import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./Section.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface SectionProps
  extends PropsWithChildren<ComponentProps<"section">> {}

export const Section: FC<SectionProps> = (props) => {
  const { children, className, ...rest } = props;

  if (!children) {
    return null;
  }

  const rootClassName = clsx(styles.section, className);

  const propsContext: PropsContext = {
    Heading: {
      level: 2,
    },
    Header: {
      className: styles.header,
      Switch: {
        className: styles.switch,
        labelPosition: "leading",
      },
      StatusBadge: {
        className: styles.statusBadge,
      },
    },
  };

  return (
    <section {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </section>
  );
};

export default Section;
