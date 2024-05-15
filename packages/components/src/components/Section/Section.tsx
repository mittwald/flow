import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";
import styles from "./Section.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Activity } from "@/components/Activity";

export interface SectionProps
  extends PropsWithChildren<ComponentProps<"section">>,
    FlowComponentProps<"Section"> {
  /** @internal */
  isActive?: boolean;
}

export const Section = flowComponent("Section", (props) => {
  const { children, className, isActive = true, ...rest } = props;

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
    <Activity isActive={isActive}>
      <section {...rest} className={rootClassName}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </section>
    </Activity>
  );
});

export default Section;
