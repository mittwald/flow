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
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { getAcceptedFiles } from "@/lib/files/acceptedFiles";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export interface FileDropZoneProps
  extends
    PropsWithClassName,
    FlowComponentProps<FocusableElement>,
    PropsWithChildren,
    Pick<Aria.InputProps, "accept" | "multiple" | "name">,
    Pick<Aria.DropZoneProps, "isDisabled"> {
  /** Called with the dropped or selected files whenever the selection changes. */
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
      wrapperProps,
      controlProps,
      fieldPropsContext,
    } = useFieldComponent(props, "FileDropZone");

    const fileFieldRef = useRef<HTMLInputElement>(null);
    const isSkeleton = useSkeletonMode();

    const rootClassName = clsx(
      styles.fileDropZone,
      isDisabled && styles.disabled,
      isSkeleton && styles.skeleton,
      className,
    );

    const propsContext: PropsContext = {
      ...fieldPropsContext,
      IllustratedMessage: {
        FileField: {
          name,
          onChange: onChangeDropZone,
          ref: fileFieldRef,
          accept: accept,
          multiple: multiple,
          Button: { variant: "outline", color: "dark" },
          isDisabled,
          isReadOnly,
          "aria-describedby": controlProps["aria-describedby"],
        },
        Heading: {
          className: styles.heading,
        },
        Icon: { className: styles.icon },
        Text: { className: styles.text },
      },
    };

    const onDropHandler = async (event: DropEvent) => {
      if (isReadOnly) {
        return;
      }

      const files = await getAcceptedFiles(event.items, accept);

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
      <div
        className={wrapperProps.className}
        inert={isSkeleton || undefined}
      >
        <PropsContextProvider
          props={propsContext}
          dependencies={[controlProps["aria-describedby"]]}
        >
          <Aria.DropZone
            className={rootClassName}
            onDrop={onDropHandler}
            isDisabled={isDisabled}
            data-readonly={isReadOnly}
          >
            {/* The drop zone is one skeleton surface, its content draws none. */}
            <SkeletonModeReset>
              <IllustratedMessage color="dark">
                {/* Inside: IllustratedMessage clears the props context it gets. */}
                <FieldErrorCaptureContext>{children}</FieldErrorCaptureContext>
              </IllustratedMessage>
            </SkeletonModeReset>
          </Aria.DropZone>
        </PropsContextProvider>
        <FieldErrorView />
      </div>
    );
  },
);

export default FileDropZone;
