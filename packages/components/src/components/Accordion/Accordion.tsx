import type { ComponentProps, FC, PropsWithChildren } from "react";
import React, { useId, useState } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import AccordionHeader from "@/components/Accordion/components/AccordionHeader/AccordionHeader";
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import { Heading } from "@/components/Heading";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";

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

  const propsContext: PropsContext = {
    Content: {
      className: styles.contentInner,
    },
  };

  const heading = deepFindOfType(children, Heading);
  const label = deepFindOfType(children, Label);
  const content = deepFindOfType(children, Content);

  return (
    <div {...rest} className={rootClassName}>
      <AccordionHeader
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        contentId={contentId}
        level={heading?.props.level}
        id={headerId}
      >
        {heading ? heading.props.children : label?.props.children}
      </AccordionHeader>
      <PropsContextProvider props={propsContext}>
        <div
          aria-labelledby={headerId}
          id={contentId}
          role="region"
          hidden={!expanded}
          className={styles.content}
        >
          {content}
        </div>
      </PropsContextProvider>
    </div>
  );
};

export default Accordion;
