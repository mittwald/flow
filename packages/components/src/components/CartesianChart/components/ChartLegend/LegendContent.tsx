import type { Props } from "recharts/types/component/DefaultLegendContent";
import type { WithChartLegendFormatters } from "./ChartLegend";
import { type FC, Suspense } from "react";
import { usePromise } from "@mittwald/react-use-promise";
import Legend, { LegendItem } from "@/components/Legend";
import SkeletonTextView from "@/views/SkeletonTextView";

import { isDataKeyWithLabel } from "@/components/CartesianChart/types";

type LegendContentType = Omit<Props, "formatter"> & WithChartLegendFormatters;

interface LegendItemTextProps extends WithChartLegendFormatters {
  name: string;
  index: number;
}

const LegendItemText: FC<LegendItemTextProps> = (props) => {
  const { formatter, name, index } = props;

  return usePromise(
    (name, index, formatter) => (formatter ? formatter(name, index) : name),
    [name, index, formatter] as const,
  );
};

const LegendContent: FC<LegendContentType> = (props) => {
  const { formatter, payload } = props;

  return (
    <Legend>
      {payload
        ?.filter(
          (entry) =>
            entry.payload &&
            "fill" in entry.payload &&
            entry.payload?.fill !== "none",
        )
        .map((entry, index) => {
          const { payload, dataKey } = entry;
          const fill =
            payload && "fill" in payload && typeof payload.fill === "string"
              ? payload.fill
              : undefined;

          const name =
            typeof dataKey === "function"
              ? isDataKeyWithLabel(payload)
                ? payload.dataKeyLabel
                : ""
              : String(dataKey);

          return (
            <LegendItem key={`legendItem-${index}`} color={fill}>
              <Suspense fallback={<SkeletonTextView />}>
                <LegendItemText
                  formatter={formatter}
                  name={name}
                  index={index}
                />
              </Suspense>
            </LegendItem>
          );
        })}
    </Legend>
  );
};

export default LegendContent;
