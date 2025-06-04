import { type FC, type PropsWithChildren, useRef } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import type { PropsWithClassName } from "@/lib/types/props";
import styles from "./FileDropZone.module.scss";
import clsx from "clsx";
import type { FileInputOnChangeHandler } from "@/components/FileField/components/FileInput";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { FocusableElement } from "@react-types/shared";

export interface FileDropZoneProps
  extends PropsWithClassName,
    FlowComponentProps<FocusableElement>,
    PropsWithChildren,
    Pick<Aria.InputProps, "accept" | "multiple" | "name"> {
  onChange?: FileInputOnChangeHandler;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const FileDropZone: FC<FileDropZoneProps> = flowComponent(
  "FileDropZone",
  (props) => {
    const {
      multiple,
      accept,
      className,
      onChange: onChangeDropZone,
      children,
      name,
    } = props;

    const fileFieldRef = useRef<HTMLInputElement>(null);
    const rootClassName = clsx(styles.fileDropZone, className);

    const propsContext: PropsContext = {
      FileField: {
        name,
        onChange: onChangeDropZone,
        ref: fileFieldRef,
        accept: accept,
        multiple: multiple,
        Button: { variant: "outline", color: "dark" },
      },
    };

    return (
      <Aria.DropZone
        className={rootClassName}
        onDrop={async (e) => {
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
            const fileTransfer = new DataTransfer();
            for (const file of multiple ? files : [files[0]]) {
              if (file) {
                fileTransfer.items.add(file);
              }
            }

            onChangeDropZone?.(fileTransfer.files);
            if (fileFieldRef.current) {
              fileFieldRef.current.files = fileTransfer.files;
            }
          }
        }}
      >
        <IllustratedMessage color="dark">
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </IllustratedMessage>
      </Aria.DropZone>
    );
  },
);

export default FileDropZone;
