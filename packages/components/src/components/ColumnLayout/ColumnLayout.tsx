import type { CSSProperties, PropsWithChildren } from "react";
import styles from "./ColumnLayout.module.scss";
import { getColumns } from "./lib/getColumns";
import clsx from "clsx";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

type GapSize = "s" | "m" | "l" | "xl";

export interface ColumnLayoutProps<
  T extends keyof HTMLElementTagNameMap = "div" | "ul",
>
  extends
    PropsWithChildren,
    PropsWithElementType<T>,
    PropsWithClassName,
    FlowComponentProps<HTMLElementTagNameMap[T]> {
  /** Column layout for container size s. */
  s?: (number | null)[];
  /** Column layout for container size m. */
  m?: (number | null)[];
  /** Column layout for container size l. */
  l?: (number | null)[];
  /**
   * Size of the row and column gap between the content blocks inside the column
   * layout.
   *
   * @default "m"
   */
  gap?: GapSize;
  /** Size of the row gap between the content blocks inside the column layout. */
  rowGap?: GapSize;
  /** Size of the column gap between the content blocks inside the column layout. */
  columnGap?: GapSize;
}

/** @flr-generate all */
export const ColumnLayout = flowComponent(
  "ColumnLayout",
  (props) => {
    const {
      children,
      className,
      s,
      m,
      l,
      gap = "m",
      rowGap = gap,
      columnGap = gap,
      elementType = "div",
      "aria-label": ariaLabel,
      ref,
      style: styleFromProps,
    } = props;

    let elementClassName = styles.columnLayout;

    s?.map((v, i) => {
      if (v === null) {
        elementClassName = clsx(elementClassName, styles[`hide-s-${i + 1}`]);
      }
    });
    m?.map((v, i) => {
      if (v === null) {
        elementClassName = clsx(elementClassName, styles[`hide-m-${i + 1}`]);
      }
    });
    l?.map((v, i) => {
      if (v === null) {
        elementClassName = clsx(elementClassName, styles[`hide-l-${i + 1}`]);
      }
    });

    const columnsS = s ? getColumns(s) : "1fr";
    const columnsM = m ? getColumns(m) : s ? columnsS : "1fr 1fr";
    const columnsL = l ? getColumns(l) : m || s ? columnsM : "1fr 1fr 1fr";

    const style = {
      ...styleFromProps,
      "--column-layout--columns-s": columnsS,
      "--column-layout--columns-m": columnsM,
      "--column-layout--columns-l": columnsL,
      "--column-layout--row-gap": `var(--column-layout--gap--${rowGap})`,
      "--column-layout--column-gap": `var(--column-layout--gap--${columnGap})`,
    } as CSSProperties;

    const rootClassName = clsx(styles.columnLayoutContainer, className);

    const Element = elementType;

    const propsContext: PropsContext = {
      Section: {
        hideSeparator: true,
      },
    };

    return (
      <div className={rootClassName} style={style}>
        <Element
          ref={ref as never}
          aria-label={ariaLabel}
          className={elementClassName}
        >
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </Element>
      </div>
    );
  },
  {
    type: "layout",
  },
);

export default ColumnLayout;
