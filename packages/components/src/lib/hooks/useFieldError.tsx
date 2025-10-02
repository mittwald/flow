import React, { useId } from "react";
import type { PropsContext } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldErrorContext } from "react-aria-components";
import { FieldError } from "@/components/FieldError";
import { TunnelExit } from "@mittwald/react-tunnel";

export const useFieldError = () => {
  const id = useId();
  const tunnelId = `${id}.fieldError`;

  const fieldErrorViewPropsContext: PropsContext = {
    FieldError: {
      tunnelId,
      className: formFieldStyles.fieldError,
    },
  };

  const FieldErrorView = () => (
    <>
      <FieldErrorContext value={null}>
        <TunnelExit id={tunnelId} />
      </FieldErrorContext>
      <FieldError className={formFieldStyles.fieldError} />
    </>
  );

  return {
    fieldErrorViewPropsContext,
    FieldErrorView,
  } as const;
};
