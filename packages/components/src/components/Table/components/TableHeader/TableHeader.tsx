import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export type TableHeaderProps = Aria.TableHeaderProps<never> & {
  hidden?: boolean;
};

export const TableHeader: FC<TableHeaderProps> = (props) => {
  const { children, className, hidden, ...rest } = props;

  const rootClassName = clsx(styles.header, hidden && styles.hidden, className);

  return (
    <Aria.TableHeader className={rootClassName} {...rest}>
      {children}
    </Aria.TableHeader>
  );
};

export default TableHeader;
