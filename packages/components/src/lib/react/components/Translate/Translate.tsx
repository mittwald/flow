import type { FC } from "react";
import type { LocalizedStrings } from "react-aria";
import useLocalizedStringFormatter from "@/lib/i18n/useLocalizedStringFormatter";

interface Props {
  locales: LocalizedStrings;
  children: string;
  variables?: Record<string, string | number | boolean>;
}

export const Translate: FC<Props> = (props) => {
  const { children, locales, variables } = props;
  const translator = useLocalizedStringFormatter(locales);
  return translator.format(children, variables);
};

export default Translate;
