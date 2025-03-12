import type { FC } from "react";
import * as Recharts from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import styles from "../Popover/Popover.module.scss";
import { LegendItem } from "../Legend/components/LegendItem";
import Heading from "../Heading";

export type ChartTooltipProps = Omit<
  Recharts.TooltipProps<ValueType, NameType>,
  | "content"
  | "contentStyle"
  | "labelClassName"
  | "labelFormatter"
  | "labelStyle"
  | "wrapperClassName"
  | "wrapperStyle"
>;

const CustomTooltip = (
  props: Recharts.TooltipContentProps<ValueType, NameType>,
) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className={styles.popover}>
        <div className={styles.content}>
          <Heading level={3}>{label}</Heading>
          {payload.map((i) => (
            <LegendItem
              color={i.fill}
              title={`${i.dataKey} ${i.value}${i.unit ? ` ${i.unit}` : ""}`}
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
  return (
    <Recharts.Tooltip
      {...props}
      content={(props) => <CustomTooltip {...props} />}
    />
  );
};

export default ChartTooltip;
