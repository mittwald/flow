import type { FC } from "react";
import { InlineCode } from "@mittwald/flow-react-components";
import { splitUnion, unquote } from "@/lib/PropertiesTables/lib/unionType";
import styles from "../PropertiesTables.module.scss";

interface TypeValueProps {
  type: string;
}

export const TypeValue: FC<TypeValueProps> = ({ type }) => {
  const members = splitUnion(type);

  if (members.length < 2) {
    return <InlineCode className={styles.type}>{type}</InlineCode>;
  }

  return (
    <span className={styles.typeChips}>
      {members.map((member) => (
        <InlineCode key={member}>{unquote(member)}</InlineCode>
      ))}
    </span>
  );
};
