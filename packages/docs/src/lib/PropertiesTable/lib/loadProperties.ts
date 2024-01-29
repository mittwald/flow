import docGenFile from "@mittwald/flow-next-components/doc-properties";
import { ComponentDoc } from "react-docgen-typescript";
import _ from "lodash";
import { PropertyGroup } from "../types";

const nodeModuleRegex = /.*\/node_modules\/([^/]*)/gm;
const componentRegex = /src\/components\/([^/]*)/gm;

const weights: { [key: string]: number } = {
  component: 0,
  "react-aria-components": 10,
  "@react-types": 20,
  other: 100,
};

export default function loadProperties(name: string): PropertyGroup[] | null {
  const docGen: ComponentDoc[][] = docGenFile;
  const componentDocGens = docGen.find((doc) =>
    doc.some(
      (singleDoc) => singleDoc.displayName.toLowerCase() === name.toLowerCase(),
    ),
  );

  if (!componentDocGens) {
    return null;
  }

  const componentDocGen = componentDocGens[0];

  if (!componentDocGen) {
    return null;
  }

  const properties = _.groupBy(
    Object.entries(componentDocGen.props).sort(([_ignored, prop]) =>
      prop.required ? 1 : 0,
    ),
    (item) => {
      if (!item[1].parent) {
        return "Other";
      }
      const match = nodeModuleRegex.exec(item[1].parent.fileName);
      if (!match) {
        return componentRegex.exec(item[1].parent.fileName)?.[1] || "Other";
      }
      return match[1];
    },
  );

  return _.sortBy(Object.entries(properties), ([key]) => {
    if (key === "Other") return weights["other"];
    return weights[key] || weights["component"];
  }).map(
    ([name, props]): PropertyGroup => ({
      name,
      properties: props.map(([, prop]) => ({
        name: prop.name,
        default: prop.defaultValue ? prop.defaultValue.value : null,
        description: prop.description,
        required: prop.required,
        type: prop.type.name,
      })),
    }),
  );
}
