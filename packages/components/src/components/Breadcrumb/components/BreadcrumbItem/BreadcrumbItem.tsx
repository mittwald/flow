import React, { FC } from "react";
import * as Aria from "react-aria-components";
import { LinkProps } from "@/components/Link";
import styles from "./BreadcrumbItem.module.scss";
import clsx from "clsx";
import { IconChevronRight } from "@/components/Icon/components/icons";

export interface BreadcrumbItemProps
  extends Pick<Aria.BreadcrumbProps, "id">,
    LinkProps {}

export const BreadcrumbItem: FC<BreadcrumbItemProps> = (props) => {
  const { children, id, className, ...rest } = props;

  const rootClassName = clsx(styles.breadcrumbItem, className);

  return (
    <Aria.Breadcrumb className={rootClassName} id={id}>
      <Aria.Link className={styles.link} {...rest}>
        {children}
      </Aria.Link>
      <IconChevronRight size="s" className={styles.icon} />
    </Aria.Breadcrumb>
  );
};

export default BreadcrumbItem;
