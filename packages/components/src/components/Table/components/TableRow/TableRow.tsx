import type { FC } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "../../Table.module.scss";

export type TableRowProps = Aria.RowProps<never> & {
  /** @internal */
  footer?: boolean;
};

/* Plain FC: technical constraint — react-aria allows render-function children,
 * which the props types of registered components cannot express. */
/** @flr-generate all */
export const TableRow: FC<TableRowProps> = (props) => {
  const { children, className, footer, ...rest } = props;

  return (
    <Aria.Row
      className={(props) =>
        clsx(
          styles.row,
          footer && styles.footer,
          typeof className === "function" ? className(props) : className,
        )
      }
      {...rest}
    >
      {children}
    </Aria.Row>
  );
};

export default TableRow;
