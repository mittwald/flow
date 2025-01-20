/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  CounterBadge,
  type CounterBadgeProps,
} from "~/components/CounterBadge";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const CounterBadgeView: FC<CounterBadgeProps> = (props) => {
  const View = useContext(viewComponentContext)["CounterBadge"] ?? CounterBadge;
  return <View {...props} />;
};

export default CounterBadgeView;
