import clsx from "clsx";
import popoverStyles from "../../../Popover/Popover.module.scss";
import Heading from "@/components/Heading";
import { LegendItem } from "@/components/Legend/components/LegendItem";
import type * as Recharts from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { WithTooltipFormatters } from "./ChartTooltip";

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
  const className = clsx(wrapperClassName, popoverStyles.popover);

  if (active && payload && payload.length) {
    return (
      <div className={className}>
        <div className={popoverStyles.content}>
          <Heading level={3}>
            {headingFormatter ? headingFormatter(label) : label}
          </Heading>
          {payload
            .filter((i) => i.fill !== "none")
            .map((i, index) => (
              <LegendItem color={i.fill} key={i.dataKey}>
                {formatter
                  ? formatter(i.value, i.dataKey, index, i.unit)
                  : `${i.dataKey} ${i.value}${i.unit ? ` ${i.unit}` : ""}`}
              </LegendItem>
            ))}
        </div>
      </div>
    );
  }

  return null;
};
