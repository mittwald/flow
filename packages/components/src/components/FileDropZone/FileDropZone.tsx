import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import clsx from "clsx";
import styles from "./FileDropZone.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import locales from "./locales/*.locale.json";
import type { DropEvent } from "react-aria";
import { useLocalizedStringFormatter } from "react-aria";
import type FileController from "@/components/FileDropZone/FileController";

export interface FileDropZoneProps extends PropsWithClassName {
  controller: FileController;
}

export const FileDropZone: FC<FileDropZoneProps> = (props) => {
  const { controller, className } = props;

  const rootClassName = clsx(styles.fileDropZone, className);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const onDrop = async (e: DropEvent) => {
    const fileDropItems = e.items.filter(
      (file) => file.kind === "file",
    ) as Aria.FileDropItem[];

    fileDropItems.map(async (f) => {
      const file = await f.getFile();
      controller.add(file);
    });
  };

  const onSelect = (e: FileList | null) => {
    const files = e ? Array.from(e) : [];
    files.map((f) => controller.add(f));
  };

  return (
    <>
      <Aria.DropZone className={rootClassName} onDrop={onDrop}>
        <Text slot="label">
          <b>{stringFormatter.format("fileDropZone.drop")}</b>
        </Text>
        <Text>{stringFormatter.format("fileDropZone.or")}</Text>
        <Aria.FileTrigger allowsMultiple onSelect={onSelect}>
          <Button variant="plain">
            {stringFormatter.format("fileDropZone.select")}
          </Button>
        </Aria.FileTrigger>
      </Aria.DropZone>
    </>
  );
};

export default FileDropZone;
