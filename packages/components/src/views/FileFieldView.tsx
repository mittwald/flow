/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { FileField, type FileFieldProps } from "@/components/FileField";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FileFieldView: FC<FileFieldProps> = memo((props) => {
  const View = useContext(viewComponentContext)["FileField"] ?? FileField;
  return <View {...props} />;
});
FileFieldView.displayName = "FileFieldView";

export default FileFieldView;
