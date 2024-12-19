import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import type { PropsWithClassName } from "@/lib/types/props";
import styles from "./FileDropZone.module.scss";
import clsx from "clsx";
import type { FileInputOnChangeHandler } from "@/components/FileField/components/FileInput";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface FileDropZoneProps
  extends PropsWithClassName,
    PropsWithChildren,
    Pick<Aria.InputProps, "accept" | "multiple"> {
  onChange?: FileInputOnChangeHandler;
}

export const FileDropZone: FC<FileDropZoneProps> = (props) => {
  const { multiple, accept, className, onChange, children } = props;

  const rootClassName = clsx(styles.fileDropZone, className);

  const propsContext: PropsContext = {
    FileField: {
      accept: accept,
      multiple: multiple,
      Button: { variant: "outline", color: "dark" },
    },
  };

  return (
    <Aria.DropZone
      className={rootClassName}
      onDrop={async (e) => {
        {
          const fileDropItems = e.items.filter(
            (file) => file.kind === "file",
          ) as Aria.FileDropItem[];

          const files = await Promise.all(
            fileDropItems
              .filter((f) => !accept || accept?.includes(f.type))
              .map(async (f) => {
                return await f.getFile();
              }),
          );

          if (files.length > 0) {
            onChange?.((multiple ? files : [files[0]]) as unknown as FileList);
          }
        }
      }}
    >
      <IllustratedMessage color="dark">
        <PropsContextProvider props={propsContext} mergeInParentContext>
          {children}
        </PropsContextProvider>
      </IllustratedMessage>
    </Aria.DropZone>
  );
};

export default FileDropZone;
