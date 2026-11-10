/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ThemeScope,
  type ThemeScopeProps,
} from "@/components/ThemeScope/ThemeScope";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ThemeScopeView: FC<ThemeScopeProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ThemeScope"] ?? ThemeScope;
  return <View {...props} />;
});
ThemeScopeView.displayName = "ThemeScopeView";

export default ThemeScopeView;
