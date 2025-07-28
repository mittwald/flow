import type { Props } from "recharts/types/component/DefaultLegendContent";
import type { WithChartLegendFormatters } from "./ChartLegend";
import type { FC } from "react";
import tokens from "@mittwald/flow-design-tokens/variables.json";
import Legend, { LegendItem } from "@/components/Legend";

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
          return (
            <LegendItem
              key={`legendItem-${index}`}
              color={
                entry.payload && "fill" in entry.payload
                  ? (entry.payload?.fill as string)
                  : tokens.color.gray[100].value
              }
            >
              {entry.dataKey
                ? formatter
                  ? formatter(entry.dataKey?.toString())
                  : entry.dataKey.toString()
                : ""}
            </LegendItem>
          );
        })}
    </Legend>
  );
};

export default LegendContent;
