import React, { type FC } from "react";
import { useLocalizedStringFormatter } from "react-aria";

import locales from "./../../locales/*.locale.json";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import ValidationResultEntry from "@/components/PasswordCreationField/components/ValidationResultEntry/ValidationResultEntry";
import { Button } from "@/components/Button";
import clsx from "clsx";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Heading } from "@/components/Heading";

interface Props {
  policyValidationResult?: ResolvedPolicyValidationResult;
  isDisabled?: boolean;
  classNames?: string;
}

export const ValidationResultButton: FC<Props> = (props) => {
  const { policyValidationResult, isDisabled, classNames } = props;

  const translate = useLocalizedStringFormatter(locales);

  const validationResultComponents = policyValidationResult?.ruleResults
    ?.filter((r) => {
      return policyValidationResult?.isEmptyValueValidation ? !r.isValid : true;
    })
    .map((result, index) => {
      return (
        <ValidationResultEntry
          key={`${result.identifier}-${index}`}
          result={result}
        />
      );
    });

  return (
    <ContextualHelpTrigger>
      <Button
        data-component="showPasswordRules"
        isDisabled={isDisabled}
        className={clsx(classNames)}
      />
      <ContextualHelp>
        <Heading>{translate.format("password.requirements.heading")}</Heading>
        {validationResultComponents}
      </ContextualHelp>
    </ContextualHelpTrigger>
  );
};
