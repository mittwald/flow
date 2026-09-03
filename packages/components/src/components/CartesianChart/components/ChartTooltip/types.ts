import {
  ChartTooltip,
  type ChartTooltipProps,
} from "@/components/CartesianChart";
import type { ComponentType } from "react";
import type {
  ChartDataValue,
  DataKeyProp,
} from "@/components/CartesianChart/types";
import type { TooltipPayloadItem } from "@/components/CartesianChart/components/ChartTooltip/TooltipLegendItem";

export const TypedChartTooltip = <
  TData extends ChartDataValue = ChartDataValue,
  XAxisDataKey extends DataKeyProp<TData> = DataKeyProp<TData>,
>() =>
  ChartTooltip as unknown as ComponentType<
    ChartTooltipProps<TData, XAxisDataKey>
  >;
export type TooltipLineFormatter<TData extends ChartDataValue> = (
  value: TData[keyof TData],
  name: DataKeyProp<TData>,
  index: number,
  unit?: TooltipPayloadItem["unit"],
) => Promise<string> | string;

export type TooltipHeadingFormatter<TTitleType> = (
  title: TTitleType,
) => Promise<string> | string;

export type TooltipLProgressBarFormatter = (
  value: number,
  unit?: TooltipPayloadItem["unit"],
) => Promise<string> | string;

export interface WithTooltipFormatters<
  TData extends ChartDataValue,
  TitleDataKey extends keyof TData = keyof TData,
> {
  /**
   * A formatter function for the lines in the tooltip. Can be used for purposes
   * like translations.
   */
  formatter?: TooltipLineFormatter<Exclude<TData, TitleDataKey>>;
  /**
   * A formatter function for the heading of the tooltip. Can be used for
   * purposes like translations.
   */
  headingFormatter?: TooltipHeadingFormatter<TData[TitleDataKey]>;
  /**
   * A formatter function for the progressBar of the tooltip. Can be used for
   * purposes like translations.
   */
  progressBarFormatter?: TooltipLProgressBarFormatter;
}
