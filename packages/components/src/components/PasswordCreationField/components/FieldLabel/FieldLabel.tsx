import type { FC } from "react";
import React from "react";
import stylesFieldLabel from "./FieldLabel.module.scss";
import type { ActionFn } from "@/components/Action";
import { Action } from "@/components/Action";
import type * as Aria from "react-aria-components";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import { isCryptographicSecureRandom } from "@mittwald/password-tools-js/generator";
import { TunnelExit } from "@mittwald/react-tunnel";
import clsx from "clsx";
import { ValidationResultButton } from "@/components/PasswordCreationField/components/ValidationResultButton/ValidationResultButton";
import { PasswordGenerateButton } from "@/components/PasswordCreationField/components/PasswordGenerateButton/PasswordGenerateButton";

interface Props extends Pick<Aria.InputProps, "disabled"> {
  className?: string;
  policyValidationResult?: ResolvedPolicyValidationResult;
  onGeneratePasswordAction?: ActionFn;
}

/** @internal */
export const FieldLabel: FC<Props> = (props) => {
  const {
    onGeneratePasswordAction,
    policyValidationResult,
    disabled: isDisabled,
    className,
  } = props;

  return (
    <div className={clsx(className, stylesFieldLabel.fieldLabel)}>
      <div className={clsx(stylesFieldLabel.container)}>
        <TunnelExit id="label" />
        <ValidationResultButton
          isDisabled={isDisabled}
          classNames={clsx(stylesFieldLabel.button, stylesFieldLabel.help)}
          policyValidationResult={policyValidationResult}
        />
      </div>
      {onGeneratePasswordAction && isCryptographicSecureRandom && (
        <Action action={onGeneratePasswordAction}>
          <PasswordGenerateButton
            classNames={clsx(
              stylesFieldLabel.button,
              stylesFieldLabel.generate,
            )}
            isDisabled={isDisabled}
          />
        </Action>
      )}
    </div>
  );
};

export default FieldLabel;
