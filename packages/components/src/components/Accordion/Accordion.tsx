import React, { useId, useState } from "react";
import type { FC, ComponentProps, PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Accordion.module.scss";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { dynamic } from "@/lib/propsContext";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Button } from "@/components/Button";
import AccordionHeader from "@/components/Accordion/components/AccordionHeader/AccordionHeader";
import { TunnelExit } from "@mittwald/react-tunnel";
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import RadioButton from "../RadioGroup/components/RadioButton";
import { Heading } from "@/components/Heading";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";

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

  const propsContext: PropsContext = {
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

  const heading = deepFindOfType(children, Heading);
  const label = deepFindOfType(children, Label);
  const content = deepFindOfType(children, Content);

  heading?.props.children;
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
        {content}
      </PropsContextProvider>
    </div>
  );
};

export default Accordion;
