import React from "react";
import { Avatar } from "./components/Avatar";
import { Text } from "~/components/Text";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "~/lib/types/props";
import styles from "./FileCard.module.scss";
import clsx from "clsx";
import { flowComponent } from "~/lib/componentFactory/flowComponent";
import { FileSizeText } from "~/components/FileCard/components/FileSizeText";
import { Link, type LinkProps } from "~/components/Link";
import Wrap from "~/components/Wrap";
import { DeleteButton } from "~/components/FileCard/components/DeleteButton";

export interface FileCardProps
  extends PropsWithClassName,
    PropsWithElementType<"div" | "li">,
    Pick<LinkProps, "onPress" | "href" | "target" | "download"> {
  /** The name of the file. */
  name: string;
  /** The type of the file. */
  type?: string;
  /** Handler that is called when the file cards delete button is clicked. */
  onDelete?: () => void;
  /** The size of the file in bytes. */
  sizeInBytes?: number;
  /** The source of an image file. */
  imageSrc?: string;
}

/** @flr-generate all */
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
    imageSrc,
  } = props;

  const rootClassName = clsx(styles.fileCard, className);

  const Element = elementType;

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
          <Avatar type={type} imageSrc={imageSrc} />
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
