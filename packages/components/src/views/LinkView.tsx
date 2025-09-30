/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Link, type LinkProps } from "@/components/Link/Link";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const LinkView: FC<LinkProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Link"] ?? Link;
  return <View {...props} />;
});
LinkView.displayName = "LinkView";

export default LinkView;
