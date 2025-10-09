import type { FC, PropsWithChildren, Ref } from "react";
import { type ChangeEvent } from "react";
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
  ref?: Ref<HTMLInputElement>;
  isReadOnly?: boolean;
}

/** @internal */
export const FileInput: FC<FileInputProps> = (props) => {
  const { children, isDisabled, onChange, isReadOnly, ref } = props;
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
      isReadOnly,
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      {children}
      <Aria.Input
        className={styles.FileInput}
        type="file"
        ref={inputRef}
        onChange={handleChange}
      />
    </PropsContextProvider>
  );
};
