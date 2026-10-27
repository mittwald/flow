import type { FC } from "react";
import { useNumberFormatter } from "react-aria";
import { Text } from "@/components/Text";
import styles from "@/components/FileCard/FileCard.module.scss";

interface Props {
  sizeInBytes: number;
}

const units = [
  "byte",
  "kilobyte",
  "megabyte",
  "gigabyte",
  "terabyte",
  "petabyte",
] as const;

const getUnit = (sizeInBytes: number) => {
  const index = Math.min(
    Math.max(Math.floor(Math.log10(sizeInBytes) / 3), 0),
    units.length - 1,
  );

  return { unit: units[index] ?? "byte", value: sizeInBytes / 1000 ** index };
};

export const FileSizeText: FC<Props> = (props) => {
  const { sizeInBytes } = props;
  const { unit, value } = getUnit(sizeInBytes);

  const formatter = useNumberFormatter({
    style: "unit",
    unit,
    unitDisplay: unit === "byte" ? "long" : "short",
    maximumFractionDigits: 1,
  });

  return <Text className={styles.subTitle}>{formatter.format(value)}</Text>;
};

export default FileSizeText;
