import docGenFile from "@mittwald/flow-react-components/doc-properties";
import type { ComponentDoc } from "react-docgen-typescript";
import type { Properties, Property } from "../types";
import { splitUnion, unquote } from "./unionType";

const eventRegex = /^on[A-Z]+.*/;
const a11yRegex = /^aria-.+/;
const nullishMembers = ["undefined", "null"];
/** `@deprecatedValues accent, plain` — but not the prop-level `@deprecated`. */
const deprecatedRegex = /@deprecated(?!\w)/;
const deprecatedValuesRegex = /^[ \t]*@deprecatedValues[ \t]+(.*)$/m;

/*
 * Drops union members the table must not offer: `undefined`/`null`, which only
 * restate the "Required" badge, and the values a prop marks `@deprecatedValues`
 * — those still work at runtime, but nothing should send a reader towards them.
 * Only top-level members go; nested ones are part of the type and have to
 * survive, e.g. ColumnLayout's `(number | null)[]`, where `null` hides a column.
 */
const hideMembers = (type: string, hidden: string[]): string => {
  const members = splitUnion(type).filter(
    (member) => !hidden.includes(unquote(member)),
  );
  return members.length > 0 ? members.join(" | ") : type;
};

const parseDeprecatedValues = (description: string): string[] =>
  (deprecatedValuesRegex.exec(description)?.[1] ?? "")
    .split(",")
    .map((value) => unquote(value.trim()))
    .filter(Boolean);

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
      const hidden = [
        ...nullishMembers,
        ...parseDeprecatedValues(prop.description),
      ];
      const type =
        prop.name === "children"
          ? "ReactNode"
          : hideMembers(prop.type.name, hidden);

      return {
        name: prop.name,
        default: normalizeDefaultValue(prop.defaultValue?.value),
        description: prop.description.replace(deprecatedValuesRegex, "").trim(),
        required: prop.required,
        deprecated: deprecatedRegex.test(prop.description),
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
