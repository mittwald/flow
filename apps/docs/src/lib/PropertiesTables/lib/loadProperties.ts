import componentIndexFile from "@mittwald/flow-react-components/component-index";
import type { Properties, Property } from "../types";

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
    .map(([name, prop]) => ({
      name,
      default: normalizeDefaultValue(prop.default) ?? prop.default ?? null,
      description: prop.description ?? null,
      required: prop.required ?? false,
      deprecated:
        prop.deprecated ?? prop.description?.includes("@deprecated") ?? false,
      type: name === "children" ? "ReactNode" : prop.type,
    }));

  return {
    events: properties.filter((prop) => eventRegex.test(prop.name)),
    accessibility: properties.filter((prop) => a11yRegex.test(prop.name)),
    other: properties.filter(
      (prop) => !(eventRegex.test(prop.name) || a11yRegex.test(prop.name)),
    ),
  };
}
