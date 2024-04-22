import React, { useId, useState } from "react";
import type { FC, ComponentProps, PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { dynamic } from "@/lib/propsContext";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";

export interface AccordionProps
  extends PropsWithChildren<ComponentProps<"div">> {
  isExpanded?: boolean;
}

export const Accordion: FC<AccordionProps> = (props) => {
  const { children, className, isExpanded = false, ...rest } = props;
  const [expanded, setExpanded] = useState(isExpanded);

  const rootClassName = clsx(
    styles.accordion,
    expanded && styles.expanded,
    className,
  );

  const headerId = useId();
  const contentId = useId();

  const headerButtonElement = (children: ReactNode) => (
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
    Heading: {
      children: dynamic((props) => headerButtonElement(props.children)),
      id: headerId,
      className: styles.header,
      level: 3,
    },
    Label: {
      children: dynamic((props) => headerButtonElement(props.children)),
      id: headerId,
      className: styles.header,
    },
    Content: {
      "aria-labelledby": headerId,
      id: contentId,
      role: "region",
      className: styles.content,
      children: dynamic((props) => (
        <div className={styles.contentInner}>{props.children}</div>
      )),
      hidden: !expanded,
    },
  };

  return (
    <div {...rest} className={rootClassName}>
      <Button onPress={() => setExpanded(!expanded)}>Toggle</Button>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default Accordion;
