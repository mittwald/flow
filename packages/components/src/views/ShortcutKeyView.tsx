/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ShortcutKey,
  type ShortcutKeyProps,
} from "@/components/ShortcutKey/ShortcutKey";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ShortcutKeyView: FC<ShortcutKeyProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ShortcutKey"] ?? ShortcutKey;
  return <View {...props} />;
});
ShortcutKeyView.displayName = "ShortcutKeyView";

export default ShortcutKeyView;
