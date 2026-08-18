import { LegendItem } from "@/components/Legend/components/LegendItem";
import type { FC } from "react";
import type { DefaultTooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { usePromise } from "@mittwald/react-use-promise";

import type { ChartDataValue } from "@/components/CartesianChart/types";
import type { WithTooltipFormatters } from "@/components/CartesianChart/components/ChartTooltip/types";

/** @internal */
export type TooltipPayloadItem = NonNullable<
  DefaultTooltipContentProps<ValueType, NameType>["payload"]
>[number];

/** @internal */
interface LegendItemLabelProps<
  TData extends ChartDataValue = ChartDataValue,
  TTooltipLabelValue extends keyof TData = keyof TData,
> extends Pick<WithTooltipFormatters<TData, TTooltipLabelValue>, "formatter"> {
  item: TooltipPayloadItem;
  index: number;
}

/** @internal */
export const TooltipLegendItem: FC<LegendItemLabelProps> = ({
  formatter,
  item,
  index,
}) => {
  const { value, dataKey, unit, fill, name } = item;

  const formattedLabel = usePromise(
    (value, dataKey, index, unit, formatter, name) =>
      formatter
        ? formatter(value, String(name), index, unit)
        : `${name ?? ""} (${value ?? ""}${unit ? unit : ""})`,
    [value, dataKey, index, unit, formatter, name] as const,
  );

  return <LegendItem color={fill}>{formattedLabel}</LegendItem>;
};
