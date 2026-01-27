import type { ComponentProps, PropsWithChildren } from "react";
import { useId } from "react";
import styles from "./Section.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ContextMenuSectionView from "@/views/ContextMenuSectionView";

export interface SectionProps
  extends
    PropsWithChildren<ComponentProps<"section">>,
    FlowComponentProps<HTMLElement> {
  /** @internal */
  renderContextMenuSection?: boolean;
  /** @internal */
  hideSeparator?: boolean;
}

/** @flr-generate all */
export const Section = flowComponent(
  "Section",
  (props) => {
    const {
      children,
      className,
      ref,
      renderContextMenuSection,
      hideSeparator,
      ...rest
    } = props;

    if (!children) {
      return null;
    }

    if (renderContextMenuSection) {
      return (
        <ContextMenuSectionView ref={ref as never}>
          {children}
        </ContextMenuSectionView>
      );
    }

    const rootClassName = clsx(
      styles.section,
      className,
      hideSeparator && styles.hideSeparator,
    );

    const headingId = useId();

    const propsContext: PropsContext = {
      Heading: {
        level: 2,
        id: headingId,
        className: styles.heading,
      },
      Header: {
        renderSectionHeader: true,
      },
      List: {
        "aria-labelledby": headingId,
      },
    };

    return (
      <section {...rest} className={rootClassName} ref={ref}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </section>
    );
  },
  {
    type: "layout",
  },
);

export default Section;
