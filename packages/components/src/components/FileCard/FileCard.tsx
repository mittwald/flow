import React from "react";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { IconClose, IconFile } from "@/components/Icon/components/icons";
import IconImage from "@/components/Icon/components/icons/IconImage";
import { Button } from "@/components/Button";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import styles from "./FileCard.module.scss";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface FileCardProps
  extends PropsWithClassName,
    PropsWithElementType<"div" | "li"> {
  name: string;
  type?: string;
  onDelete?: () => void;
  sizeInBytes?: number;
}

export const FileCard = flowComponent("FileCard", (props) => {
  const {
    onDelete,
    type,
    sizeInBytes,
    name,
    className,
    elementType = "div",
  } = props;

  const rootClassName = clsx(styles.fileCard, className);

  const Element = elementType;

  return (
    <Element className={rootClassName}>
      <Avatar>{type?.includes("image") ? <IconImage /> : <IconFile />}</Avatar>
      <span className={styles.text}>
        <Text className={styles.title}>
          <b>{name}</b>
        </Text>
        {sizeInBytes && (
          <Text>
            {new Intl.NumberFormat(undefined, {
              notation: "compact",
              style: "unit",
              unit: "byte",
              unitDisplay: "narrow",
            }).format(sizeInBytes)}
          </Text>
        )}
      </span>
      {onDelete && (
        <Button size="s" variant="plain" color="secondary" onPress={onDelete}>
          <IconClose />
        </Button>
      )}
    </Element>
  );
});

export default FileCard;
