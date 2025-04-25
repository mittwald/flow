/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { LinkProps } from "@/components/Link";
import React, { useContext } from "react";
import { Link } from "@/components/Link";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LinkView: FC<LinkProps> = (props) => {
  const View = useContext(viewComponentContext)["Link"] ?? Link;
  return <View {...props} />;
};

export default LinkView;
