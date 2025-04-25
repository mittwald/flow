/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { FieldErrorProps } from "@/components/FieldError";
import React, { useContext } from "react";
import { FieldError } from "@/components/FieldError";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const FieldErrorView: FC<FieldErrorProps> = (props) => {
  const View = useContext(viewComponentContext)["FieldError"] ?? FieldError;
  return <View {...props} />;
};

export default FieldErrorView;
