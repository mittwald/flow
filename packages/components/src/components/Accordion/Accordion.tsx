import type { ComponentProps, FC, PropsWithChildren, ReactNode } from "react";
import { useId, useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Activity } from "@/components/Activity";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface AccordionProps extends PropsWithChildren<
  ComponentProps<"div">
> {
  /** Whether the accordion should be initially expanded. */
  defaultExpanded?: boolean;
  /** The visual variant of the accordion. @default "default" */
  variant?: "default" | "outline";
}

/** @flr-generate all */
export const Accordion: FC<AccordionProps> = flowComponent(
  "Accordion",
  (props) => {
    const {
      children,
      className,
      defaultExpanded = false,
      variant = "default",
      ...rest
    } = props;
    const [expanded, setExpanded] = useState(defaultExpanded);

    const rootClassName = clsx(
      styles.accordion,
      expanded && styles.expanded,
      className,
      variant === "outline" && styles.outline,
    );

    const headerId = useId();
    const contentId = useId();

    const headerButton = (children: ReactNode) => (
      <Button
        tunnel={null}
        unstyled
        aria-expanded={expanded}
        className={styles.headerButton}
        onPress={() => setExpanded((expanded) => !expanded)}
        aria-controls={contentId}
      >
        {children}
        <IconChevronDown className={styles.chevron} />
      </Button>
    );

    const propsContext: PropsContext = {
      Content: {
        className: styles.contentInner,
        tunnel: {
          id: "content",
          component: "Accordion",
        },
      },
      Heading: {
        className: styles.header,
        level: 4,
        size: "xs",
        children: dynamic((props) => headerButton(props.children)),
      },
      Label: {
        className: styles.header,
        children: dynamic((props) => headerButton(props.children)),
      },
    };

    return (
      <div {...rest} className={rootClassName}>
        <PropsContextProvider props={propsContext} dependencies={[expanded]}>
          {children}
          <div
            aria-labelledby={headerId}
            id={contentId}
            role="region"
            hidden={!expanded}
            className={styles.content}
          >
            <Activity isActive={expanded} inactiveDelay={1000}>
              <UiComponentTunnelExit id="content" component="Accordion" />
            </Activity>
          </div>
        </PropsContextProvider>
      </div>
    );
  },
  {
    type: "layout",
  },
);

export default Accordion;
