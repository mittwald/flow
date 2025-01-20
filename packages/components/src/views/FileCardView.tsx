/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { FileCard, type FileCardProps } from "~/components/FileCard";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const FileCardView: FC<FileCardProps> = (props) => {
  const View = useContext(viewComponentContext)["FileCard"] ?? FileCard;
  return <View {...props} />;
};

export default FileCardView;
