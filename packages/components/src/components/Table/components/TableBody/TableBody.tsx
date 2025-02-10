import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export type TableBodyProps = Aria.TableBodyProps<never>;

/** @flr-generate all */
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
