import type { PropsWithChildren } from "react";
import React, { type ChangeEvent, forwardRef } from "react";
import * as Aria from "react-aria-components";
import { useObjectRef } from "@react-aria/utils";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import styles from "./FileInput.module.scss";

export type FileInputOnChangeHandler = (files: FileList | null) => void;

/** @internal */
export interface FileInputProps extends PropsWithChildren {
  onChange?: FileInputOnChangeHandler;
  isDisabled?: boolean;
}

/** @internal */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (props, ref) => {
    const { children, isDisabled, onChange } = props;
    const inputRef = useObjectRef(ref);

    const handlePress = () => {
      if (inputRef.current?.value) {
        inputRef.current.value = "";
        onChange?.(null);
      }
      inputRef.current?.click();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.files);
    };

    const propsContext: PropsContext = {
      Button: {
        onPress: handlePress,
        className: styles.trigger,
        isDisabled,
      },
    };

    return (
      <PropsContextProvider props={propsContext} mergeInParentContext>
        {children}
        <Aria.Input
          style={{ display: "none" }}
          type="file"
          ref={inputRef}
          onChange={handleChange}
        />
      </PropsContextProvider>
    );
  },
);
