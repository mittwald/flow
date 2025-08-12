import React from "react";
import { Avatar } from "./components/Avatar";
import { Text } from "@/components/Text";
import type {
  PropsWithClassName,
  PropsWithElementType,
} from "@/lib/types/props";
import styles from "./FileCard.module.scss";
import clsx from "clsx";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { FileSizeText } from "@/components/FileCard/components/FileSizeText";
import { Link, type LinkProps } from "@/components/Link";
import Wrap from "@/components/Wrap";
import { DeleteButton } from "@/components/FileCard/components/DeleteButton";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { OptionsButton } from "@/components/List/components/Items/components/Item/components/OptionsButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface FileCardProps
  extends FlowComponentProps<HTMLDivElement | HTMLLIElement>,
    PropsWithClassName,
    PropsWithElementType<"div" | "li">,
    Pick<LinkProps, "onPress" | "href" | "target" | "download"> {
  /** The name of the file. */
  name?: string;
  /** The type of the file. */
  type?: string;
  /** Handler that is called when the file cards delete button is clicked. */
  onDelete?: () => void;
  /** The size of the file in bytes. */
  sizeInBytes?: number;
  /** The source of an image file. */
  imageSrc?: string;
  /** Whether the file card is in a failed state. */
  isFailed?: boolean;
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
    isFailed,
  } = props;

  const rootClassName = clsx(
    styles.fileCard,
    isFailed && styles["failed"],
    className,
  );

  const propsContext: PropsContext = {
    ContextMenu: {
      wrapWith: <OptionsButton />,
      placement: "bottom right",
    },
    Text: {
      elementType: "span",
      className: styles.subTitle,
      tunnelId: "subTitle",
    },
    ProgressBar: {
      size: "s",
      tunnelId: "progressBar",
    },
    Button: { variant: "plain", color: "secondary" },
  };

  const Element = elementType;

  return (
    <PropsContextProvider props={propsContext} mergeInParentContext>
      <TunnelProvider>
        <Element ref={ref as never} className={rootClassName}>
          <Wrap if={(href || onPress) && !isFailed}>
            <Link
              className={styles.link}
              unstyled
              href={href}
              onPress={onPress}
              target={target}
              download={download}
            >
              <Avatar type={type} imageSrc={imageSrc} isFailed={isFailed} />

              <span className={styles.text}>
                {name && (
                  <Text className={styles.title}>
                    <b>{name}</b>
                  </Text>
                )}
                {sizeInBytes && <FileSizeText sizeInBytes={sizeInBytes} />}
                <TunnelExit id="subTitle" />
                <TunnelExit id="progressBar" />
              </span>
            </Link>
          </Wrap>
          {children}
          {onDelete && <DeleteButton onDelete={onDelete} />}
        </Element>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default FileCard;
