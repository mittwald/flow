import { Children, type FC } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";
import { IsFirstColumnContext } from "./context";

export type TableHeaderProps = Aria.TableHeaderProps<never>;

/** @flr-generate all */
export const TableHeader: FC<TableHeaderProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.header, className);

  const columns =
    typeof children === "function"
      ? children
      : Children.toArray(children).map((column, index) => (
          <IsFirstColumnContext key={index} value={index === 0}>
            {column}
          </IsFirstColumnContext>
        ));

  return (
    <Aria.TableHeader className={rootClassName} {...rest}>
      {columns}
    </Aria.TableHeader>
  );
};

export default TableHeader;
