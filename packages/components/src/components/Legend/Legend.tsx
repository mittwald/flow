import type { FC } from "react";
import * as Recharts from "recharts";
import type { ContentType } from "recharts/types/component/DefaultLegendContent";
import { LegendItem } from "./components/LegendItem";
import styles from "./Legend.module.scss";
import tokens from "@mittwald/flow-design-tokens/variables.json";

export type LegendProps = Omit<
  Recharts.LegendProps,
  "content" | "font-family" | "font-size"
>;

export const Legend: FC<LegendProps> = (props) => {
  const { ...rest } = props;

  const legendContent: ContentType = (props) => {
    const { payload } = props;

    return (
      <ul className={styles.legendContent}>
        {payload?.map((entry, index) => (
          <li key={`legendItem-${index}`}>
            <LegendItem
              title={entry.dataKey?.toString() ?? ""}
              color={
                entry.payload && "fill" in entry.payload
                  ? (entry.payload?.fill as string)
                  : tokens.color.gray[100].value
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  return <Recharts.Legend {...rest} content={legendContent} />;
};

export default Legend;
