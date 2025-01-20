/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import {
  LightBoxTrigger,
  type LightBoxTriggerProps,
} from "~/components/LightBox";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const LightBoxTriggerView: FC<LightBoxTriggerProps> = (props) => {
  const View =
    useContext(viewComponentContext)["LightBoxTrigger"] ?? LightBoxTrigger;
  return <View {...props} />;
};

export default LightBoxTriggerView;
