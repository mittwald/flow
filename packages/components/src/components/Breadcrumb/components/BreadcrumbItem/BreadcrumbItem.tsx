import React, { FC } from "react";
import * as Aria from "react-aria-components";
import { LinkProps } from "@/components/Link";
import styles from "./BreadcrumbItem.module.scss";
import clsx from "clsx";
import { Icon } from "@/components/Icon";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

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
      <Icon className={styles.icon} faIcon={faChevronRight} />
    </Aria.Breadcrumb>
  );
};

export default BreadcrumbItem;
