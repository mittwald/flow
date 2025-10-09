/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  FileCardList,
  type FileCardListProps,
} from "@/components/FileCardList/FileCardList";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FileCardListView: FC<FileCardListProps> = memo((props) => {
  const View = useContext(viewComponentContext)["FileCardList"] ?? FileCardList;
  return <View {...props} />;
});
FileCardListView.displayName = "FileCardListView";

export default FileCardListView;
