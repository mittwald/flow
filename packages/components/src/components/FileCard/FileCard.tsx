import React from "react";
import { Avatar } from "./components/Avatar";
import { Text } from "@/components/Text";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import styles from "./FileCard.module.scss";
import clsx from "clsx";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { FileSizeText } from "@/components/FileCard/components/FileSizeText";
import { Link } from "@/components/Link";
import type { LinkProps } from "@/components/Link";
import Wrap from "@/components/Wrap";
import { DeleteButton } from "@/components/FileCard/components/DeleteButton";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsContext } from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/components/Item/components/OptionsButton";

export interface FileCardProps
  extends FlowComponentProps<HTMLDivElement | HTMLLIElement>,
    PropsWithClassName,
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
    ref,
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
    children,
  } = props;

  const rootClassName = clsx(styles.fileCard, className);

  const propsContext: PropsContext = {
    ContextMenu: {
      wrapWith: <OptionsButton />,
      placement: "bottom right",
    },
  };

  const Element = elementType;

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <Element ref={ref as never} className={rootClassName}>
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
        {onDelete && children === undefined && (
          <DeleteButton onDelete={onDelete} />
        )}
        {children}
      </Element>
    </PropsContextProvider>
  );
});

export default FileCard;
