import { LegendItem } from "@/components/Legend/components/LegendItem";
import type { WithTooltipFormatters } from "./ChartTooltip";
import type { FC } from "react";
import type { DefaultTooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { usePromise } from "@mittwald/react-use-promise";
import type { ChartDataValue } from "@/components/CartesianChart/CartesianChart";

/** @internal */
export type TooltipPayloadItem = NonNullable<
  DefaultTooltipContentProps<ValueType, NameType>["payload"]
>[number];

/** @internal */
interface LegendItemLabelProps<TData = ChartDataValue> extends Pick<
  WithTooltipFormatters<TData>,
  "formatter"
> {
  item: TooltipPayloadItem;
  index: number;
}

/** @internal */
export const TooltipLegendItem: FC<LegendItemLabelProps> = ({
  formatter,
  item,
  index,
}) => {
  const { value, dataKey, unit, fill } = item;

  const formattedLabel = usePromise(
    async (value, dataKey, index, unit, formatter) => {
      if (!formatter) {
        return `${dataKey} (${value}${unit ? ` ${unit}` : ""})`;
      }

      return formatter(value, dataKey as never, index, unit);
    },
    [value, dataKey, index, unit, formatter] as const,
  );

  return <LegendItem color={fill}>{formattedLabel}</LegendItem>;
};
