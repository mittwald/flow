/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Modal, type ModalProps } from "@/components/Modal/Modal";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const ModalView: FC<ModalProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Modal"] ?? Modal;
  return <View {...props} />;
});
ModalView.displayName = "ModalView";

export default ModalView;
