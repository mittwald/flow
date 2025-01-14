import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "../../Breadcrumb.module.scss";
import clsx from "clsx";
import { IconChevronRight } from "~/components/Icon/components/icons";

export type BreadcrumbItemProps = PropsWithChildren;

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
