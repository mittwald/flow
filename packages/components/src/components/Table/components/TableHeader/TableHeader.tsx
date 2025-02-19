import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export type TableHeaderProps = Aria.TableHeaderProps<never>;

/** @flr-generate all */
export const TableHeader: FC<TableHeaderProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.header, className);

  return (
    <Aria.TableHeader className={rootClassName} {...rest}>
      {children}
    </Aria.TableHeader>
  );
};

export default TableHeader;
