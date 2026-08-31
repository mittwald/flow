import componentIndexFile from "@mittwald/flow-react-components/component-index";
import type { Properties, Property } from "../types";
import { splitUnion, unquote } from "./unionType";

const eventRegex = /^on[A-Z]+.*/;
const a11yRegex = /^aria-.+/;

interface ComponentIndexFile {
  components: Record<
    string,
    {
      props: Record<
        string,
        {
          type: string;
          required?: true;
          default?: string;
          description?: string;
          deprecated?: true;
        }
      >;
    }
  >;
}

const componentIndex = (componentIndexFile as unknown as ComponentIndexFile)
  .components;

const byLocalName = new Map<string, ComponentIndexFile["components"][string]>();
for (const [key, entry] of Object.entries(componentIndex)) {
  const separator = key.indexOf("#");
  const localName = key.slice(separator + 1).toLowerCase();
  if (separator === -1 || !byLocalName.has(localName)) {
    byLocalName.set(localName, entry);
  }
}

/** `@deprecatedValues accent, plain` — but not the prop-level `@deprecated`. */
const deprecatedValuesRegex = /^[ \t]*@deprecatedValues[ \t]+(.*)$/m;

/*
 * Drops the union members a prop marks `@deprecatedValues` — those still work at
 * runtime, but nothing should send a reader towards them. Only top-level members
 * go; nested ones are part of the type and have to survive, e.g. ColumnLayout's
 * `(number | null)[]`, where `null` hides a column. `undefined`/`null` are gone
 * before this: the component index strips them (dev/component-index/filterProps).
 */
const hideMembers = (type: string, hidden: string[]): string => {
  if (hidden.length === 0) {
    return type;
  }
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
  const component = byLocalName.get(name.toLowerCase().replaceAll(" ", ""));

  if (!component) {
    return null;
  }

  const properties: Property[] = Object.entries(component.props)
    .filter(([name, prop]) => name && prop)
    .filter(([, prop]) => !prop.description?.includes("@internal"))
    .map(([name, prop]) => {
      const description = prop.description ?? "";

      return {
        name,
        default: normalizeDefaultValue(prop.default) ?? prop.default ?? null,
        description:
          description.replace(deprecatedValuesRegex, "").trim() || null,
        required: prop.required ?? false,
        deprecated: prop.deprecated ?? false,
        type:
          name === "children"
            ? "ReactNode"
            : hideMembers(prop.type, parseDeprecatedValues(description)),
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
