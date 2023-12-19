import React from "react";
import { ComponentDoc } from "react-docgen-typescript";
import docGenFile from "@mittwald/flow-components/doc-properties";
import _ from "lodash";
import styles from "./PropertiesTable.module.css";

interface PropertiesTableProps {
  name: string;
}

const nodeModuleRegex = /.*\/node_modules\/([^/]*)/gm;
const componentRegex = /src\/components\/([^/]*)/gm;

const weights: { [key: string]: number } = {
  component: 0,
  "react-aria-components": 10,
  "@react-types": 20,
  other: 100,
};

export const PropertiesTable: React.FC<PropertiesTableProps> = ({ name }) => {
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
    (it) => {
      if (!it[1].parent) {
        return "Other";
      }
      const match = nodeModuleRegex.exec(it[1].parent.fileName);
      if (!match) {
        return componentRegex.exec(it[1].parent.fileName)?.[1] || "Other";
      }
      return match[1];
    },
  );

  return (
    <div className={styles.root}>
      <div className={styles.headline}>
        <span>Source</span>
        <span>Property</span>
        <span>Type</span>
        <span>Required</span>
        <span>Default</span>
        <span>Description</span>
      </div>
      <div className={styles.rows}>
        {_.sortBy(Object.entries(properties), ([key]) => {
          if (key === "Other") return weights["other"];
          return weights[key] || weights["component"];
        }).map(([groupName, group]) => (
          <>
            <div className={styles.sectionHeadline}>
              <span>{groupName}</span>
            </div>
            {group.map(([, prop]) => (
              <>
                <span className={styles.col}>{prop.name}</span>
                <span className={styles.col}>{prop.type.name}</span>
                <span className={styles.col}>
                  {prop.required ? "Yes" : "No"}
                </span>
                <span className={styles.col}>
                  {prop.defaultValue ? prop.defaultValue.value : "-"}
                </span>
                <span className={styles.col}>
                  {prop.description ? prop.description : "-"}
                </span>
              </>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};
