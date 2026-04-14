import type { ReactNode } from "react";
import type {
  DataKey,
  DataKeyValue,
} from "@/components/CartesianChart/CartesianChart";

import { YAxis, type YAxisProps } from "@/components/CartesianChart";

export const TypedYAxis = <TData>() =>
  YAxis as <
    const TProp extends DataKey<TData>,
    TMatcherValue = DataKeyValue<TData, TProp>,
  >(
    props: YAxisProps<TData, TProp, TMatcherValue>,
  ) => ReactNode;
