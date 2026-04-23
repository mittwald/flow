import type { Props } from "recharts/types/component/DefaultLegendContent";
import type { WithChartLegendFormatters } from "./ChartLegend";
import type { FC } from "react";
import Legend, { LegendItem } from "@/components/Legend";

import { isDataKeyWithLabel } from "@/components/CartesianChart/types";

type LegendContentType = Omit<Props, "formatter"> & WithChartLegendFormatters;

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
              {formatter ? formatter(name, index) : name}
            </LegendItem>
          );
        })}
    </Legend>
  );
};

export default LegendContent;
