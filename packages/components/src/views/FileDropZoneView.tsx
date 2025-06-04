/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  FileDropZone,
  type FileDropZoneProps,
} from "@/components/FileDropZone";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FileDropZoneView: FC<FileDropZoneProps> = (props) => {
  const View = useContext(viewComponentContext)["FileDropZone"] ?? FileDropZone;
  return <View {...props} />;
};

export default FileDropZoneView;
