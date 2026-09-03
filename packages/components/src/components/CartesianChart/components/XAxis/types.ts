import type { ReactNode } from "react";
import { XAxis, type XAxisProps } from "@/components/CartesianChart";
import type {
  ChartDataValue,
  DataKeyProp,
  DataKeyValue,
} from "@/components/CartesianChart/types";

export const TypedXAxis = <
  TData extends ChartDataValue = ChartDataValue,
  XAxisDataKey extends DataKeyProp<TData> = DataKeyProp<TData>,
>() =>
  XAxis as <
    const TProp extends XAxisDataKey,
    XAxisDataKeyValue = DataKeyValue<TData, TProp>,
  >(
    props: XAxisProps<TData, TProp, XAxisDataKeyValue>,
  ) => ReactNode;
