import type { FC } from "react";
import React, { useState } from "react";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import clsx from "clsx";
import styles from "./FileDropZone.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import locales from "./locales/*.locale.json";
import type { DropEvent } from "react-aria";
import { useLocalizedStringFormatter } from "react-aria";

export type FileDropZoneProps = PropsWithClassName;

export const FileDropZone: FC<FileDropZoneProps> = (props) => {
  const { className } = props;

  const [files, setFiles] = useState<File[]>([]);

  const rootClassName = clsx(styles.fileDropZone, className);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const onDrop = async (e: DropEvent) => {
    const fileDropItems = e.items.filter(
      (file) => file.kind === "file",
    ) as Aria.FileDropItem[];

    const files = await Promise.all(
      fileDropItems.map(async (f) => await f.getFile()),
    );

    setFiles(files);
  };

  const onSelect = (e: FileList | null) => {
    const files = e ? Array.from(e) : [];
    setFiles(files);
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

      {files.map((file) => (
        <div
          key={file.name}
          style={{ border: "1px solid black", padding: "8px", margin: "8px" }}
        >
          {file.name}
          <Button onPress={() => setFiles(files.filter((f) => f !== file))}>
            Remove File
          </Button>
        </div>
      ))}
    </>
  );
};

export default FileDropZone;
