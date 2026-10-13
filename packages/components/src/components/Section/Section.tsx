import type { ComponentProps, PropsWithChildren } from "react";
import { useId } from "react";
import styles from "./Section.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ContextMenuSectionView from "@/views/ContextMenuSectionView";
import { SectionHeadingProvider, useSectionHeading } from "./context";

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

    const headingId = useId();
    const sectionHeading = useSectionHeading(headingId);

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
      hideSeparator && styles.hideSeparator,
      className,
    );

    const propsContext: PropsContext = {
      Heading: {
        level: 2,
        id: headingId,
        className: styles.heading,
      },
      Header: {
        renderSectionHeader: true,
      },
    };

    return (
      <section {...rest} className={rootClassName} ref={ref}>
        <SectionHeadingProvider value={sectionHeading}>
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </SectionHeadingProvider>
      </section>
    );
  },
  {
    type: "layout",
  },
);

export default Section;
