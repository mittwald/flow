import React, { type FC, Suspense } from "react";
import type { TooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { usePromise } from "@mittwald/react-use-promise";
import Heading from "@/components/Heading";
import type { WithTooltipFormatters } from "@/components/CartesianChart";
import { TooltipLegendItem } from "@/components/CartesianChart/components/ChartTooltip/TooltipLegendItem";
import SkeletonTextView from "@/views/SkeletonTextView";

export const TooltipContent: FC<
  WithTooltipFormatters &
    Omit<TooltipContentProps<ValueType, NameType>, "formatter">
> = (props) => {
  const { headingFormatter, formatter, label, payload } = props;

  const formattedHeading = usePromise(
    async (label, formatter) => {
      if (!formatter) {
        return label;
      }

      return formatter(label);
    },
    [label, headingFormatter] as const,
  );

  const items = payload
    .filter((item) => item.fill !== "none")
    .map((item, index) => {
      return (
        <Suspense key={item.dataKey} fallback={<SkeletonTextView />}>
          <TooltipLegendItem formatter={formatter} item={item} index={index} />
        </Suspense>
      );
    });

  return (
    <>
      <Heading level={4}>{formattedHeading}</Heading>
      {items}
    </>
  );
};
