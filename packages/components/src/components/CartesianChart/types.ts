export type ChartDataValue<TValue = unknown> = Record<string, TValue>;

export interface DataKeyWithLabel<TData extends ChartDataValue> {
  dataKey: DataKeyFn<TData>;
  dataKeyLabel: DataKeyProp<TData>;
}

export type DataKeyFn<
  TData extends ChartDataValue = ChartDataValue,
  TValue = unknown,
> = (data: TData) => TValue;

export type DataKeyProp<TData extends ChartDataValue = ChartDataValue> =
  keyof TData;

export type DataKey<
  TData extends ChartDataValue = ChartDataValue,
  TValue = unknown,
> = DataKeyProp<TData> | DataKeyFn<TData, TValue>;

export type DataKeyValue<
  TData extends ChartDataValue,
  TDataKey extends DataKey<TData>,
> = TDataKey extends (data: TData) => infer R
  ? R
  : TDataKey extends keyof TData
    ? TData[TDataKey]
    : never;

export const isDataKeyWithLabel = <TData extends ChartDataValue>(
  obj: unknown,
): obj is DataKeyWithLabel<TData> => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "dataKeyLabel" in obj &&
    typeof obj.dataKeyLabel === "string"
  );
};

/**
 * The orientation of the chart's axes and graphical items. `"horizontal"` puts
 * the category axis on the x-axis (bars grow upwards), `"vertical"` puts it on
 * the y-axis (bars grow to the side).
 */
export type CartesianChartLayout = "horizontal" | "vertical";
