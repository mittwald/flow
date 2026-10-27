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

const maximumFractionDigits = 1;

const getUnit = (sizeInBytes: number) => {
  let index = Math.min(
    Math.max(Math.floor(Math.log10(sizeInBytes) / 3), 0),
    units.length - 1,
  );

  // 999,960 bytes would otherwise round to "1,000 kB"
  const roundingFactor = 10 ** maximumFractionDigits;
  const rounded =
    Math.round((sizeInBytes / 1000 ** index) * roundingFactor) / roundingFactor;
  if (rounded >= 1000 && index < units.length - 1) {
    index++;
  }

  return { unit: units[index] ?? "byte", value: sizeInBytes / 1000 ** index };
};

export const FileSizeText: FC<Props> = (props) => {
  const { sizeInBytes } = props;
  const { unit, value } = getUnit(sizeInBytes);

  const formatter = useNumberFormatter({
    style: "unit",
    unit,
    unitDisplay: unit === "byte" ? "long" : "short",
    maximumFractionDigits,
  });

  return <Text className={styles.subTitle}>{formatter.format(value)}</Text>;
};

export default FileSizeText;
