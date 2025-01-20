/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  FileCardList,
  type FileCardListProps,
} from "~/components/FileCardList";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const FileCardListView: FC<FileCardListProps> = (props) => {
  const View = useContext(viewComponentContext)["FileCardList"] ?? FileCardList;
  return <View {...props} />;
};

export default FileCardListView;
