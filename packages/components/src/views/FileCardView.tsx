/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { FileCard, type FileCardProps } from "@/components/FileCard";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FileCardView: FC<FileCardProps> = memo((props) => {
  const View = useContext(viewComponentContext)["FileCard"] ?? FileCard;
  return <View {...props} />;
});
FileCardView.displayName = "FileCardView";

export default FileCardView;
