import type { FC } from "react";
import { Text } from "@/components/Text";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import locales from "./../../locales/*.locale.json";
import styles from "./ValidationResultEntry.module.scss";
import type { RuleValidationResult } from "@/integrations/@mittwald/password-tools-js";
import AlertIcon from "../../../AlertIcon";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";

interface Props {
  result: Partial<RuleValidationResult>;
  unspecifiedRules?: boolean;
}

/** @internal */
export const ValidationResultEntry: FC<Props> = (props) => {
  const { result, unspecifiedRules = false } = props;
  const translate = useLocalizedStringFormatter(locales);

  const icon = <AlertIcon status={result.isValid ? "success" : "warning"} />;

  let [translationKey, translationValues] = generateValidationTranslation(
    result,
    true,
  );

  if (unspecifiedRules) {
    translationKey = `${translationKey}.unspecified`;
    translationValues = {};
  }

  return (
    <Text
      className={styles.validationResultEntry}
      data-rule={result.ruleType}
      data-rule-valid={result.isValid}
      key={translationKey}
    >
      {icon}
      {translate.format(translationKey, translationValues)}
    </Text>
  );
};

export default ValidationResultEntry;
