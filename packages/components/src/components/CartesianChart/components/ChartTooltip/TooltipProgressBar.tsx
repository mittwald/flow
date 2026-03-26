import type { FC } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { Label } from "@/components/Label";
import type { TooltipPayloadItem } from "@/components/CartesianChart/components/ChartTooltip/TooltipLegendItem";

interface TooltipProgressBarProps {
  items: TooltipPayloadItem[];
}

export const TooltipProgressBar: FC<TooltipProgressBarProps> = (props) => {
  const { items } = props;

  const segments = items.map((i) => ({
    title: i.dataKey as string,
    value: i.value as number,
  }));

  return (
    <ProgressBar showLegend={false} segments={segments}>
      <Label>total</Label>
    </ProgressBar>
  );
};
