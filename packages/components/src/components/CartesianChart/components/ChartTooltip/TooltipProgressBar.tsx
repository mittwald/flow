import type { FC } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { Label } from "@/components/Label";
import type { TooltipPayloadItem } from "@/components/CartesianChart/components/ChartTooltip/TooltipLegendItem";
import locales from "../../locales/*.locale.json";
import styles from "./ChartTooltip.module.scss";
import type { WithTooltipFormatters } from "@/components/CartesianChart";
import { usePromise } from "@mittwald/react-use-promise";
import type { ChartDataValue } from "@/components/CartesianChart/CartesianChart";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";

interface TooltipProgressBarProps<TData = ChartDataValue> extends Pick<
  WithTooltipFormatters<TData>,
  "progressBarFormatter"
> {
  items: TooltipPayloadItem[];
}

export const TooltipProgressBar: FC<TooltipProgressBarProps> = (props) => {
  const { items, progressBarFormatter } = props;

  const areaItems = items.filter(
    (item) => item.fill !== "none" && item.graphicalItemId.includes("area"),
  );

  const stringFormatter = useLocalizedStringFormatter(
    locales,
    "CartesianChart",
  );

  const unit = areaItems[0]?.unit;

  const segments = areaItems.map((i) => ({
    title: i.dataKey as string,
    value: i.value as number,
    color: i.fill,
  }));

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  const formattedLabel = usePromise(
    async (value, unit, formatter) => {
      if (!formatter) {
        return `${value}${unit ? ` ${unit}` : ""}`;
      }

      return formatter(value, unit);
    },
    [total, unit, progressBarFormatter] as const,
  );

  if (areaItems.length < 2) {
    return null;
  }

  return (
    <ProgressBar
      className={styles.progressBar}
      showLegend={false}
      segments={segments}
      valueLabel={formattedLabel}
      maxValue={unit === "%" ? undefined : total}
    >
      <Label>{stringFormatter.format("tooltip.progressBar.total")}</Label>
    </ProgressBar>
  );
};
