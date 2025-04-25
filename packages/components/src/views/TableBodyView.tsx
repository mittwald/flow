/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { TableBodyProps } from "@/components/Table";
import React, { useContext } from "react";
import { TableBody } from "@/components/Table";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const TableBodyView: FC<TableBodyProps> = (props) => {
  const View = useContext(viewComponentContext)["TableBody"] ?? TableBody;
  return <View {...props} />;
};

export default TableBodyView;
