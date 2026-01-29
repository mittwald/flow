/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import {
  ModalTrigger,
  type ModalTriggerProps,
} from "@/components/Modal/components/ModalTrigger/ModalTrigger";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ModalTriggerView: FC<ModalTriggerProps> = memo((props) => {
  const View = useContext(viewComponentContext)["ModalTrigger"] ?? ModalTrigger;
  return <View {...props} />;
});
ModalTriggerView.displayName = "ModalTriggerView";

export default ModalTriggerView;
