import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export interface TableBodyProps extends Aria.TableBodyProps<never> {}

export const TableBody: FC<TableBodyProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.body, className);

  return (
    <Aria.TableBody className={rootClassName} {...rest}>
      {children}
    </Aria.TableBody>
  );
};

export default TableBody;
