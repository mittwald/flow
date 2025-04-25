/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { FileCardProps } from "@/components/FileCard";
import React, { useContext } from "react";
import { FileCard } from "@/components/FileCard";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FileCardView: FC<FileCardProps> = (props) => {
  const View = useContext(viewComponentContext)["FileCard"] ?? FileCard;
  return <View {...props} />;
};

export default FileCardView;
