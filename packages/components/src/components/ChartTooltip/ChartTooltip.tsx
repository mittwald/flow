import type { FC } from "react";
import * as Recharts from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import styles from "../Popover/Popover.module.scss";
import { LegendItem } from "../Legend/components/LegendItem";
import Heading from "../Heading";
import clsx from "clsx";

interface WithTooltipFormatters {
  formatter?: (
    value: ValueType,
    name: NameType,
    index: number,
    unit?: string | number,
  ) => string;
  headingFormatter?: (title: string) => string;
}

export interface ChartTooltipProps
  extends Pick<
      Recharts.TooltipProps<ValueType, NameType>,
      "wrapperClassName" | "allowEscapeViewBox"
    >,
    WithTooltipFormatters {}

interface TooltipContentProps
  extends Pick<
      Recharts.TooltipContentProps<ValueType, NameType>,
      "active" | "payload" | "label" | "wrapperClassName"
    >,
    WithTooltipFormatters {}

const CustomTooltip = (props: TooltipContentProps) => {
  const {
    active,
    payload,
    formatter,
    headingFormatter,
    label,
    wrapperClassName,
  } = props;
  const className = clsx(wrapperClassName, styles.popover);

  if (active && payload && payload.length) {
    return (
      <div className={className}>
        <div className={styles.content}>
          <Heading level={3}>
            {headingFormatter ? headingFormatter(label) : label}
          </Heading>
          {payload.map((i, index) => (
            <LegendItem
              color={i.fill}
              title={
                formatter
                  ? formatter(i.value, i.dataKey, index, i.unit)
                  : `${i.dataKey} ${i.value}${i.unit ? ` ${i.unit}` : ""}`
              }
              key={i.dataKey}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export const ChartTooltip: FC<ChartTooltipProps> = (props) => {
  const { formatter, headingFormatter, ...rest } = props;
  return (
    <Recharts.Tooltip
      {...rest}
      content={(props) => {
        const {
          formatter: ignoredFormatter,
          labelFormatter: ignoredLabelFormatter,
          ...rest
        } = props;

        return (
          <CustomTooltip
            formatter={formatter}
            headingFormatter={headingFormatter}
            {...rest}
          />
        );
      }}
    />
  );
};

export default ChartTooltip;
