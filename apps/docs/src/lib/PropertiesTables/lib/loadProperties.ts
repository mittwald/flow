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

export default function loadProperties(name: string): Properties | null {
  const component = byLocalName.get(name.toLowerCase().replaceAll(" ", ""));

  if (!component) {
    return null;
  }

  const properties: Property[] = Object.entries(component.props).map(
    ([propName, prop]) => ({
      name: propName,
      default: prop.default ?? null,
      description: prop.description ?? null,
      required: prop.required ?? false,
      deprecated: prop.deprecated ?? false,
      type: prop.type,
    }),
  );

  return {
    events: properties.filter((prop) => eventRegex.test(prop.name)),
    accessibility: properties.filter((prop) => a11yRegex.test(prop.name)),
    other: properties.filter(
      (prop) => !(eventRegex.test(prop.name) || a11yRegex.test(prop.name)),
    ),
  };
}
