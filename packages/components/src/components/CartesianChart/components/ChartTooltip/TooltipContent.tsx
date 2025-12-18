import clsx from "clsx";
import Heading from "@/components/Heading";
import { LegendItem } from "@/components/Legend/components/LegendItem";
import type * as Recharts from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { WithTooltipFormatters } from "./ChartTooltip";
import styles from "./ChartTooltip.module.scss";

interface TooltipContentProps
  extends Pick<
      Recharts.TooltipContentProps<ValueType, NameType>,
      "active" | "payload" | "label" | "wrapperClassName"
    >,
    WithTooltipFormatters {}

export const TooltipContent = (props: TooltipContentProps) => {
  const {
    active,
    payload,
    formatter,
    headingFormatter,
    label,
    wrapperClassName,
  } = props;
  const className = clsx(wrapperClassName, styles.tooltip);

  if (active && payload && payload.length) {
    return (
      <div className={className}>
        <Heading level={4}>
          {headingFormatter ? headingFormatter(label) : label}
        </Heading>
        {payload
          .filter((i) => i.fill !== "none")
          .map((i, index) => (
            <LegendItem color={i.fill} key={i.dataKey}>
              {formatter
                ? formatter(i.value, i.dataKey, index, i.unit)
                : `${i.dataKey}: ${i.value} ${i.unit ? ` ${i.unit}` : ""}`}
            </LegendItem>
          ))}
      </div>
    );
  }

  return null;
};
