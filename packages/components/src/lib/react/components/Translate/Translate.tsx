import type { FC } from "react";
import type { LocalizedStrings } from "react-aria";
import { useMessageFormatter } from "react-aria";

interface Props {
  locales: LocalizedStrings;
  children: string;
  variables?: Record<string, string | number | boolean>;
}

export const Translate: FC<Props> = (props) => {
  const { children, locales, variables } = props;
  const formatter = useMessageFormatter(locales);
  return formatter(children, variables);
};

export default Translate;
