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
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { FileSizeText } from "@/components/FileCard/components/FileSizeText";

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

  const stringFormatter = useLocalizedStringFormatter(locales);

  const avatar = (
    <Avatar color="blue">
      {type?.includes("image") ? <IconImage /> : <IconFile />}
    </Avatar>
  );

  return (
    <Element className={rootClassName}>
      {avatar}
      <span className={styles.text}>
        <Text className={styles.title}>
          <b>{name}</b>
        </Text>
        {sizeInBytes && <FileSizeText sizeInBytes={sizeInBytes} />}
      </span>
      {onDelete && (
        <Button
          aria-label={stringFormatter.format(`fileCard.delete`)}
          size="s"
          variant="plain"
          color="secondary"
          onPress={onDelete}
        >
          <IconClose />
        </Button>
      )}
    </Element>
  );
});

export default FileCard;
