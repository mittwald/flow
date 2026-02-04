import { LegendItem } from "@/components/Legend/components/LegendItem";
import type { WithTooltipFormatters } from "./ChartTooltip";
import type { FC } from "react";
import { useResolvedLabel } from "@/components/CartesianChart/hooks/useResolvedLabel";
import type { DefaultTooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

/** @internal */
export type TooltipPayloadItem = NonNullable<
  DefaultTooltipContentProps<ValueType, NameType>["payload"]
>[number];

/** @internal */
interface LegendItemLabelProps extends Pick<
  WithTooltipFormatters,
  "formatter"
> {
  item: TooltipPayloadItem;
  index: number;
}

/** @internal */
export const TooltipLegendItem: FC<LegendItemLabelProps> = ({
  formatter = (value, name, _index, unit) =>
    `${name}: ${value}${unit ? ` ${unit}` : ""}`,
  item,
  index,
}) => {
  const { value, dataKey, unit, fill } = item;

  const formattedLabel = useResolvedLabel(formatter, [
    value,
    dataKey,
    index,
    unit,
  ]);

  return <LegendItem color={fill}>{formattedLabel}</LegendItem>;
};
