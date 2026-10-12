import componentIndexFile from "@mittwald/flow-react-components/component-index";

export interface ComponentIndexEntry {
  importFrom: string[];
  remote: {
    available: boolean;
    excludedProps?: string[];
  };
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

interface ComponentIndexFile {
  components: Record<string, ComponentIndexEntry>;
}

/**
 * Keyed like the component index: a bare name for a component of the root
 * barrel, `<specifier>#<name>` for one that only an integration entry exports.
 */
export const componentIndex = (
  componentIndexFile as unknown as ComponentIndexFile
).components;

const byLocalName = new Map<string, ComponentIndexEntry>();
for (const [key, entry] of Object.entries(componentIndex)) {
  const separator = key.indexOf("#");
  const localName = key.slice(separator + 1).toLowerCase();
  if (separator === -1 || !byLocalName.has(localName)) {
    byLocalName.set(localName, entry);
  }
}

/** Resolves a docs page's `component` frontmatter to its index entry. */
export const componentIndexEntry = (
  name: string,
): ComponentIndexEntry | undefined =>
  byLocalName.get(name.toLowerCase().replaceAll(" ", ""));
