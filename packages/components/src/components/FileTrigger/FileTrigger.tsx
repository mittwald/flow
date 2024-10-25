import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import type { PropsWithClassName } from "@/lib/types/props";
import type FileController from "@/components/FileTrigger/FileController";

export interface FileTriggerProps
  extends PropsWithClassName,
    Aria.FileTriggerProps {
  controller: FileController;
}

export const FileTrigger: FC<FileTriggerProps> = (props) => {
  const { controller, children, ...rest } = props;

  return (
    <Aria.FileTrigger
      {...rest}
      onSelect={(e) => controller.selectFile(e, props.allowsMultiple)}
    >
      {children}
    </Aria.FileTrigger>
  );
};

export default FileTrigger;
