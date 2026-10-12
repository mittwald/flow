/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  CoachMark,
  type CoachMarkProps,
} from "@/components/CoachMark/CoachMark";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CoachMarkView: FC<CoachMarkProps> = memo((props) => {
  const View = useContext(viewComponentContext)["CoachMark"] ?? CoachMark;
  return <View {...props} />;
});
CoachMarkView.displayName = "CoachMarkView";

export default CoachMarkView;
