import React from "react";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { IconFile } from "@/components/Icon/components/icons";
import IconImage from "@/components/Icon/components/icons/IconImage";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import styles from "./FileCard.module.scss";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { FileSizeText } from "@/components/FileCard/components/FileSizeText";
import { Link, type LinkProps } from "@/components/Link";
import Wrap from "@/components/Wrap";
import { DeleteButton } from "@/components/FileCard/components/DeleteButton";

export interface FileCardProps
  extends PropsWithClassName,
    PropsWithElementType<"div" | "li">,
    Pick<LinkProps, "onPress" | "href" | "target" | "download"> {
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
    onPress,
    href,
    target,
    download,
  } = props;

  const rootClassName = clsx(styles.fileCard, className);

  const Element = elementType;

  const avatar = (
    <Avatar color="blue">
      {type?.includes("image") ? <IconImage /> : <IconFile />}
    </Avatar>
  );

  return (
    <Element className={rootClassName}>
      <Wrap if={href || onPress}>
        <Link
          className={styles.link}
          unstyled
          href={href}
          onPress={onPress}
          target={target}
          download={download}
        >
          {avatar}
          <span className={styles.text}>
            <Text className={styles.title}>
              <b>{name}</b>
            </Text>
            {sizeInBytes && <FileSizeText sizeInBytes={sizeInBytes} />}
          </span>
        </Link>
      </Wrap>
      {onDelete && <DeleteButton onDelete={onDelete} />}
    </Element>
  );
});

export default FileCard;
