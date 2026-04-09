import type { FC } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { Label } from "@/components/Label";
import type { TooltipPayloadItem } from "@/components/CartesianChart/components/ChartTooltip/TooltipLegendItem";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../../locales/*.locale.json";
import styles from "./ChartTooltip.module.scss";

interface TooltipProgressBarProps {
  items: TooltipPayloadItem[];
}

export const TooltipProgressBar: FC<TooltipProgressBarProps> = (props) => {
  const { items } = props;

  const areaItems = items.filter(
    (item) => item.fill !== "none" && item.graphicalItemId.includes("area"),
  );

  const stringFormatter = useLocalizedStringFormatter(locales);

  const unit = areaItems[0]?.unit;

  const segments = areaItems.map((i) => ({
    title: i.dataKey as string,
    value: i.value as number,
    color: i.fill,
  }));

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  if (areaItems.length < 2) {
    return null;
  }

  return (
    <ProgressBar
      className={styles.progressBar}
      showLegend={false}
      segments={segments}
      valueLabel={unit ? `${total} ${unit}` : total}
      maxValue={unit === "%" ? undefined : total}
    >
      <Label>{stringFormatter.format("cartesianChart.total")}</Label>
    </ProgressBar>
  );
};
