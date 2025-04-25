/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { FileFieldProps } from "@/components/FileField";
import React, { useContext } from "react";
import { FileField } from "@/components/FileField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FileFieldView: FC<FileFieldProps> = (props) => {
  const View = useContext(viewComponentContext)["FileField"] ?? FileField;
  return <View {...props} />;
};

export default FileFieldView;
