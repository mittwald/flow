/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { ModalTrigger, type ModalTriggerProps } from "~/components/Modal";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const ModalTriggerView: FC<ModalTriggerProps> = (props) => {
  const View = useContext(viewComponentContext)["ModalTrigger"] ?? ModalTrigger;
  return <View {...props} />;
};

export default ModalTriggerView;
