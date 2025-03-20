import type { Props } from "recharts/types/component/DefaultLegendContent";
import styles from "../../Legend.module.scss";
import { LegendItem } from "../LegendItem";
import type { WithLegendFormatters } from "../../Legend";
import type { FC } from "react";
import tokens from "@mittwald/flow-design-tokens/variables.json";

type LegendContentType = Omit<Props, "formatter"> & WithLegendFormatters;

const LegendContent: FC<LegendContentType> = (props) => {
  const { formatter, payload } = props;

  return (
    <ul className={styles.legendContent}>
      {payload
        ?.filter(
          (entry) =>
            entry.payload &&
            "fill" in entry.payload &&
            entry.payload?.fill !== "none",
        )
        .map((entry, index) => {
          return (
            <li key={`legendItem-${index}`}>
              <LegendItem
                title={
                  entry.dataKey
                    ? formatter
                      ? formatter(entry.dataKey?.toString())
                      : entry.dataKey.toString()
                    : ""
                }
                color={
                  entry.payload && "fill" in entry.payload
                    ? (entry.payload?.fill as string)
                    : tokens.color.gray[100].value
                }
              />
            </li>
          );
        })}
    </ul>
  );
};

export default LegendContent;
