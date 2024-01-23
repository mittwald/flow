import React, { FC } from "react";
import * as Aria from "react-aria-components";
import { Link, LinkProps } from "@/components/Link";
import styles from "./BreadcrumbItem.module.css";
import clsx from "clsx";
import { Icon } from "@/components/Icon";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

export interface BreadcrumbItemProps
  extends Pick<Aria.BreadcrumbProps, "id">,
    LinkProps {}

export const BreadcrumbItem: FC<BreadcrumbItemProps> = (props) => {
  const { children, id, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <Aria.Breadcrumb className={rootClassName} id={id}>
      <Link className={styles.link} {...rest}>
        {children}
      </Link>
      <Icon className={styles.icon} faIcon={faChevronRight} />
    </Aria.Breadcrumb>
  );
};

export default BreadcrumbItem;
