import { type FC, type PropsWithChildren, useRef } from "react";
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
import type { DropEvent, FocusableElement } from "@react-types/shared";
import { addAwaitedArrayBuffer } from "@mittwald/flow-core";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface FileDropZoneProps
  extends PropsWithClassName,
    FlowComponentProps<FocusableElement>,
    PropsWithChildren,
    Pick<Aria.InputProps, "accept" | "multiple" | "name">,
    Pick<Aria.DropZoneProps, "isDisabled"> {
  onChange?: FileInputOnChangeHandler;
  /** Whether the component is read only. */
  isReadOnly?: boolean;
}

/** @flr-generate all */
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
      isDisabled,
      isReadOnly,
    } = props;

    const {
      FieldErrorView,
      FieldErrorCaptureContext,
      fieldProps,
      fieldPropsContext,
    } = useFieldComponent(props);

    const fileFieldRef = useRef<HTMLInputElement>(null);
    const rootClassName = clsx(
      styles.fileDropZone,
      isDisabled && styles.disabled,
      className,
    );

    const propsContext: PropsContext = {
      ...fieldPropsContext,
      FileField: {
        name,
        onChange: onChangeDropZone,
        ref: fileFieldRef,
        accept: accept,
        multiple: multiple,
        Button: { variant: "outline", color: "dark" },
        isDisabled,
        isReadOnly,
      },
      Heading: {
        className: styles.heading,
      },
      Icon: { className: styles.icon },
      Text: { className: styles.text },
    };

    const onDropHandler = async (event: DropEvent) => {
      if (isReadOnly) {
        return;
      }

      const fileDropItems = event.items.filter(
        (file) => file.kind === "file",
      ) as Aria.FileDropItem[];

      const files = await Promise.all(
        fileDropItems
          .filter((f) => !accept || accept?.includes(f.type))
          .map(async (f) => {
            const file = await f.getFile();
            return await addAwaitedArrayBuffer(file);
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
    };

    return (
      <div {...fieldProps}>
        <FieldErrorCaptureContext>
          <PropsContextProvider props={propsContext}>
            <Aria.DropZone
              className={rootClassName}
              onDrop={onDropHandler}
              isDisabled={isDisabled}
              data-readonly={isReadOnly}
            >
              <IllustratedMessage color="dark">{children}</IllustratedMessage>
            </Aria.DropZone>
          </PropsContextProvider>
        </FieldErrorCaptureContext>
        <FieldErrorView />
      </div>
    );
  },
);

export default FileDropZone;
