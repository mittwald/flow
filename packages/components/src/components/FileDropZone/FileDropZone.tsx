import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { IconPicture, IconUpload } from "@/components/Icon/components/icons";
import { Heading } from "@/components/Heading";
import { FileField } from "@/components/FileField";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import type { PropsWithClassName } from "@/lib/types/props";
import styles from "./FileDropZone.module.scss";
import clsx from "clsx";
import type { FileInputOnChangeHandler } from "@/components/FileField/components/FileInput";

export interface FileDropZoneProps
  extends PropsWithClassName,
    Pick<Aria.InputProps, "accept" | "multiple" | "name" | "size"> {
  onChange?: FileInputOnChangeHandler;
}

export const FileDropZone: FC<FileDropZoneProps> = (props) => {
  const { multiple, name, accept, size, className, onChange } = props;
  const stringFormatter = useLocalizedStringFormatter(locales);

  const rootClassName = clsx(styles.fileDropZone, className);

  const isImageUpload =
    accept?.split(",").some((a) => !a.includes("image")) === false;

  return (
    <Aria.DropZone
      className={rootClassName}
      onDrop={async (e) => {
        {
          const fileDropItems = e.items.filter(
            (file) => file.kind === "file",
          ) as Aria.FileDropItem[];

          const files = (
            await Promise.all(
              fileDropItems
                .filter((f) => !accept || accept?.includes(f.type))
                .map(async (f) => {
                  return await f.getFile();
                }),
            )
          ).filter((f) => !size || f.size <= size);

          if (files.length > 0) {
            onChange?.((multiple ? files : [files[0]]) as unknown as FileList);
          }
        }
      }}
    >
      <IllustratedMessage color="dark">
        {isImageUpload ? <IconPicture /> : <IconUpload />}
        <Heading>
          {stringFormatter.format(
            `fileDropZone.${isImageUpload ? "image" : "file"}.drop${multiple ? ".multiple" : ""}`,
          )}
        </Heading>
        {accept || (size && <Text></Text>)}
        <FileField
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={onChange}
        >
          <Button variant="outline" color="dark">
            {stringFormatter.format(
              `fileDropZone.${isImageUpload ? "image" : "file"}.select${multiple ? ".multiple" : ""}`,
            )}
          </Button>
        </FileField>
      </IllustratedMessage>
    </Aria.DropZone>
  );
};

export default FileDropZone;
