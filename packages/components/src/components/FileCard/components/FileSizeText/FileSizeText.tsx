import type { FC } from "react";
import React from "react";
import { Text } from "@/components/Text";
import styles from "@/components/FileCard/FileCard.module.scss";

interface Props {
  sizeInBytes: number;
}

export const FileSizeText: FC<Props> = (props) => {
  const { sizeInBytes } = props;

  return (
    <Text className={styles.subTitle}>
      {new Intl.NumberFormat("en-US", {
        notation: "compact",
        style: "unit",
        unit: "byte",
        unitDisplay: "narrow",
      }).format(sizeInBytes)}
    </Text>
  );
};

export default FileSizeText;
