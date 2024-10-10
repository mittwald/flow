import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { FileTriggerProps } from "react-aria-components";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import clsx from "clsx";
import styles from "./FileDropZone.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type FileController from "@/components/FileTrigger/FileController";
import { FileTrigger } from "@/components/FileTrigger";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { IconPicture, IconUpload } from "@/components/Icon/components/icons";
import { Heading } from "@/components/Heading";

export interface FileDropZoneProps
  extends PropsWithClassName,
    PropsWithChildren,
    Pick<FileTriggerProps, "allowsMultiple" | "acceptedFileTypes"> {
  controller: FileController;
  /** @default "file" */
  type?: "file" | "image";
}

export const FileDropZone: FC<FileDropZoneProps> = (props) => {
  const {
    controller,
    allowsMultiple,
    acceptedFileTypes,
    className,
    children,
    type = "file",
  } = props;

  const rootClassName = clsx(styles.fileDropZone, className);

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <>
      <Aria.DropZone
        className={rootClassName}
        onDrop={(e) =>
          controller.dropFile(e, acceptedFileTypes, allowsMultiple)
        }
      >
        <IllustratedMessage color="dark">
          {type === "file" ? <IconUpload /> : <IconPicture />}
          <Heading>
            {stringFormatter.format(
              `fileDropZone.${type}.drop${allowsMultiple ? ".multiple" : ""}`,
            )}
          </Heading>
          {children}
          <FileTrigger
            acceptedFileTypes={acceptedFileTypes}
            allowsMultiple={allowsMultiple}
            controller={controller}
          >
            <Button variant="outline">
              {stringFormatter.format(
                `fileDropZone.${type}.select${allowsMultiple ? ".multiple" : ""}`,
              )}
            </Button>
          </FileTrigger>
        </IllustratedMessage>
      </Aria.DropZone>
    </>
  );
};

export default FileDropZone;
