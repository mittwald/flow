import type { ComponentProps, PropsWithChildren } from "react";
import { useId } from "react";
import React from "react";
import styles from "./Section.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Activity } from "@/components/Activity";
import { ContextMenuSection } from "@/components/ContextMenu/components/ContextMenuSection";

export interface SectionProps
  extends PropsWithChildren<ComponentProps<"section">>,
    FlowComponentProps {
  /** @internal */
  isActive?: boolean;
  /** @internal */
  renderContextMenuSection?: boolean;
}

export const Section = flowComponent("Section", (props) => {
  const {
    children,
    className,
    isActive = true,
    refProp: ref,
    renderContextMenuSection,
    ...rest
  } = props;

  if (!children) {
    return null;
  }

  if (renderContextMenuSection) {
    return <ContextMenuSection>{children}</ContextMenuSection>;
  }

  const rootClassName = clsx(styles.section, className);

  const headingId = useId();

  const propsContext: PropsContext = {
    Heading: {
      level: 2,
      id: headingId,
    },
    Header: {
      renderSectionHeader: true,
    },
    List: {
      "aria-labelledby": headingId,
    },
  };

  return (
    <Activity isActive={isActive}>
      <section {...rest} className={rootClassName} ref={ref}>
        <PropsContextProvider props={propsContext} mergeInParentContext>
          {children}
        </PropsContextProvider>
      </section>
    </Activity>
  );
});

export default Section;
