/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  FileDropZone,
  type FileDropZoneProps,
} from "@/components/FileDropZone/FileDropZone";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FileDropZoneView: FC<FileDropZoneProps> = memo((props) => {
  const View = useContext(viewComponentContext)["FileDropZone"] ?? FileDropZone;
  return <View {...props} />;
});
FileDropZoneView.displayName = "FileDropZoneView";

export default FileDropZoneView;
