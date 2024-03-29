import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./BreadcrumbItem.module.scss";
import clsx from "clsx";
import { IconChevronRight } from "@/components/Icon/components/icons";

export interface BreadcrumbItemProps extends PropsWithChildren {}

export const BreadcrumbItem: FC<BreadcrumbItemProps> = (props) => {
  const { children } = props;

  const rootClassName = clsx(styles.breadcrumbItem);

  return (
    <Aria.Breadcrumb className={rootClassName}>
      {children}
      <IconChevronRight size="s" className={styles.icon} />
    </Aria.Breadcrumb>
  );
};

export default BreadcrumbItem;
