import type { ComponentProps, FC, PropsWithChildren, ReactNode } from "react";
import React, { useId, useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { TunnelExit } from "@mittwald/react-tunnel";

export interface AccordionProps
  extends PropsWithChildren<ComponentProps<"div">> {
  defaultExpanded?: boolean;
}

export const Accordion: FC<AccordionProps> = (props) => {
  const { children, className, defaultExpanded = false, ...rest } = props;
  const [expanded, setExpanded] = useState(defaultExpanded);

  const rootClassName = clsx(
    styles.accordion,
    expanded && styles.expanded,
    className,
  );

  const headerId = useId();
  const contentId = useId();
  const contentTunnelId = useId();

  const headerButton = (children: ReactNode) => (
    <Button
      unstyled
      aria-expanded={expanded}
      className={styles.headerButton}
      onPress={() => setExpanded(!expanded)}
      aria-controls={contentId}
    >
      {children}
      <IconChevronDown className={styles.chevron} />
    </Button>
  );

  const propsContext: PropsContext = {
    Content: {
      className: styles.contentInner,
      tunnelId: contentTunnelId,
    },

    Heading: {
      className: styles.header,
      level: 4,
      children: dynamic((props) => headerButton(props.children)),
    },
    Label: {
      className: styles.header,
      children: dynamic((props) => headerButton(props.children)),
    },
  };

  return (
    <div {...rest} className={rootClassName}>
      <PropsContextProvider
        mergeInParentContext
        props={propsContext}
        dependencies={[expanded]}
      >
        {children}

        <div
          aria-labelledby={headerId}
          id={contentId}
          role="region"
          hidden={!expanded}
          className={styles.content}
        >
          <TunnelExit id={contentTunnelId} />
        </div>
      </PropsContextProvider>
    </div>
  );
};

export default Accordion;
