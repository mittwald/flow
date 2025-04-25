/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { FileCardListProps } from "@/components/FileCardList";
import React, { useContext } from "react";
import { FileCardList } from "@/components/FileCardList";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FileCardListView: FC<FileCardListProps> = (props) => {
  const View = useContext(viewComponentContext)["FileCardList"] ?? FileCardList;
  return <View {...props} />;
};

export default FileCardListView;
