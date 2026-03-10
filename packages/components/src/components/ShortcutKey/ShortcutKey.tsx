import type { FC } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";

export interface ShortcutKeyProps {
  children: string;
}

export const shortcutKeys: ("mod" | "alt" | "shift" | "control")[] = [
  "mod",
  "alt",
  "shift",
  "control",
];

export const ShortcutKey: FC<ShortcutKeyProps> = ({ children }) => {
  const stringFormatter = useLocalizedStringFormatter(locales);

  const isMac = navigator.userAgent.includes("Mac");

  const translatedChildren = children.replace(
    /\b(mod|alt|shift|control)\b/gi,
    (key) => {
      const label = stringFormatter.format(`shortcutKey.${key}`);

      if (key === "mod") return isMac ? "⌘" : label;
      if (key === "control") return isMac ? "⌃" : label;
      if (key === "alt") return isMac ? "⌥" : label;
      return label;
    },
  );

  return <>{translatedChildren}</>;
};
