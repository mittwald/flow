/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Modal, type ModalProps } from "~/components/Modal";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const ModalView: FC<ModalProps> = (props) => {
  const View = useContext(viewComponentContext)["Modal"] ?? Modal;
  return <View {...props} />;
};

export default ModalView;
