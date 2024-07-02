import type { FC } from "react";
import React from "react";
import type { FileTriggerProps } from "react-aria-components";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import clsx from "clsx";
import styles from "./FileDropZone.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type FileController from "@/components/FileTrigger/FileController";
import { FileTrigger } from "@/components/FileTrigger";

export interface FileDropZoneProps
  extends PropsWithClassName,
    Pick<FileTriggerProps, "allowsMultiple" | "acceptedFileTypes"> {
  controller: FileController;
}

export const FileDropZone: FC<FileDropZoneProps> = (props) => {
  const { controller, allowsMultiple, acceptedFileTypes, className } = props;

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
        <Text slot="label">
          <b>
            {stringFormatter.format(
              allowsMultiple
                ? "fileDropZone.dropMultiple"
                : "fileDropZone.drop",
            )}
          </b>
        </Text>
        <Text>{stringFormatter.format("fileDropZone.or")}</Text>
        <FileTrigger
          acceptedFileTypes={acceptedFileTypes}
          allowsMultiple={allowsMultiple}
          controller={controller}
        >
          <Button variant="plain">
            {stringFormatter.format(
              allowsMultiple
                ? "fileDropZone.selectMultiple"
                : "fileDropZone.select",
            )}
          </Button>
        </FileTrigger>
      </Aria.DropZone>
    </>
  );
};

export default FileDropZone;
