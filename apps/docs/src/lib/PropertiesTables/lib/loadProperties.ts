import docGenFile from "@mittwald/flow-react-components/doc-properties";
import type { ComponentDoc } from "react-docgen-typescript";
import type { Properties, Property } from "../types";
import { splitUnion } from "./unionType";

const eventRegex = /^on[A-Z]+.*/;
const a11yRegex = /^aria-.+/;
const nullishMembers = ["undefined", "null"];

/*
 * `undefined` and `null` as top-level union members only restate the "Required"
 * badge. Nested ones are part of the type and have to survive: ColumnLayout's
 * `(number | null)[]` documents that `null` hides a column.
 */
const stripTopLevelNullish = (type: string): string => {
  const members = splitUnion(type).filter(
    (member) => !nullishMembers.includes(member),
  );
  return members.length > 0 ? members.join(" | ") : type;
};

/** An `@default: x` JSDoc tag keeps its colon in the generated metadata. */
const normalizeDefaultValue = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }
  return value.replace(/^\s*:/, "").replace(/\s+/g, " ").trim() || null;
};

export default function loadProperties(name: string): Properties | null {
  const typeDocGenFile = (docGenFile ?? []) as unknown as ComponentDoc[];
  const componentDoc = typeDocGenFile.find(
    (doc) =>
      doc.displayName.toLowerCase() === name.toLowerCase().replaceAll(" ", ""),
  );

  if (!componentDoc) {
    return null;
  }

  const properties: Property[] = Object.entries(componentDoc.props)
    .filter(([name, prop]) => name && prop)
    .filter(([, prop]) => !prop.description.includes("@internal"))
    .map(([, prop]) => {
      const type =
        prop.name === "children"
          ? "ReactNode"
          : stripTopLevelNullish(prop.type.name);

      return {
        name: prop.name,
        default: normalizeDefaultValue(prop.defaultValue?.value),
        description: prop.description,
        required: prop.required,
        deprecated: prop.description.includes("@deprecated"),
        type,
      };
    });

  return {
    events: properties.filter((prop) => eventRegex.test(prop.name)),
    accessibility: properties.filter((prop) => a11yRegex.test(prop.name)),
    other: properties.filter(
      (prop) => !(eventRegex.test(prop.name) || a11yRegex.test(prop.name)),
    ),
  };
}
