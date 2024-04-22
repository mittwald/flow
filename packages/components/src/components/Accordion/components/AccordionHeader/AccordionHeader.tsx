import type { FC, PropsWithChildren } from "react";
import type { ButtonProps } from "@/components/Button";
import { Button } from "@/components/Button";
import styles from "@/components/Accordion/Accordion.module.scss";
import { IconChevronDown } from "@/components/Icon/components/icons";
import React from "react";

interface AccordionHeaderProps
  extends Pick<ButtonProps, "onPress">,
    PropsWithChildren {
  expanded: boolean;
  id: string;
  contentId: string;
  level?: number;
}

export const AccordionHeader: FC<AccordionHeaderProps> = (props) => {
  const { expanded, onPress, children, contentId } = props;

  return (
    <Button
      unstyled
      aria-expanded={expanded}
      className={styles.headerButton}
      onPress={onPress}
      aria-controls={contentId}
    >
      {children}
      <IconChevronDown className={styles.chevron} />
    </Button>
  );
};

export default AccordionHeader;
