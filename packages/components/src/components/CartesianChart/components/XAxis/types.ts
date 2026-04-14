import type { ReactNode } from "react";
import type {
  DataKey,
  DataKeyValue,
} from "@/components/CartesianChart/CartesianChart";

import { XAxis, type XAxisProps } from "@/components/CartesianChart";

export const TypedXAxis = <TData>() =>
  XAxis as <
    const TProp extends DataKey<TData>,
    TMatcherValue = DataKeyValue<TData, TProp>,
  >(
    props: XAxisProps<TData, TProp, TMatcherValue>,
  ) => ReactNode;
