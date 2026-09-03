import type { ReactNode } from "react";

import { YAxis, type YAxisProps } from "@/components/CartesianChart";
import type {
  ChartDataValue,
  DataKeyProp,
  DataKeyValue,
} from "@/components/CartesianChart/types";

export const TypedYAxis = <TData extends ChartDataValue = ChartDataValue>() =>
  YAxis as <
    const TProp extends DataKeyProp<TData>,
    TMatcherValue = DataKeyValue<TData, TProp>,
  >(
    props: YAxisProps<TData, TProp, TMatcherValue>,
  ) => ReactNode;
