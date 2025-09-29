/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  CounterBadge,
  type CounterBadgeProps,
} from "@/components/CounterBadge/CounterBadge";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const CounterBadgeView: FC<CounterBadgeProps> = memo((props) => {
  const View = useContext(viewComponentContext)["CounterBadge"] ?? CounterBadge;
  return <View {...props} />;
});
CounterBadgeView.displayName = "CounterBadgeView";

export default CounterBadgeView;
