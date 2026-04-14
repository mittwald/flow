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
import { TooltipProgressBar } from "@/components/CartesianChart/components/ChartTooltip/TooltipProgressBar";
import { Flex } from "@/components/Flex";

/** @internal */
export const TooltipContent: FC<
  WithTooltipFormatters &
    Omit<TooltipContentProps<ValueType, NameType>, "formatter"> & {
      showProgressBar?: boolean;
    }
> = (props) => {
  const {
    headingFormatter,
    formatter,
    progressBarFormatter,
    label,
    payload,
    showProgressBar,
  } = props;

  const formattedHeading = usePromise(
    async (label, formatter) => {
      if (!formatter) {
        return label;
      }

      return formatter(label);
    },
    [label, headingFormatter] as const,
  );

  const filteredPayload = payload.filter((item) => item.fill !== "none");

  const items = filteredPayload.map((item, index) => {
    return (
      <Suspense key={item.dataKey} fallback={<SkeletonTextView />}>
        <TooltipLegendItem formatter={formatter} item={item} index={index} />
      </Suspense>
    );
  });

  return (
    <Flex direction="column" gap="s">
      <Heading level={4}>{formattedHeading}</Heading>
      {showProgressBar && (
        <TooltipProgressBar
          progressBarFormatter={progressBarFormatter}
          items={filteredPayload}
        />
      )}
      <div>{items}</div>
    </Flex>
  );
};
