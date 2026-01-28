import docGenFile from "@mittwald/flow-react-components/doc-properties";
import type { ComponentDoc } from "react-docgen-typescript";
import type { Properties, Property } from "../types";

const eventRegex = /^on[A-Z]+.*/;
const a11yRegex = /^aria-.+/;
const optionalRegex = / \| (undefined|null)/g;

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
      let type = prop.type.name.replaceAll(optionalRegex, "");

      if (prop.name === "children") {
        type = "ReactNode";
      }
      return {
        name: prop.name,
        default: prop.defaultValue ? prop.defaultValue.value : null,
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
