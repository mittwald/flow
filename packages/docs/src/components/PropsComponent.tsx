import React from "react";
import { ComponentDoc } from "react-docgen-typescript";
import docGenFile from "@mittwald/flow-components/doc-gen";

interface PropsComponentProps {
  name: string;
}

export const PropsComponent: React.FC<PropsComponentProps> = ({ name }) => {
  const docGen: ComponentDoc[][] = docGenFile;
  const componentDocGens = docGen.find(
    (doc) => doc[0].displayName.toLowerCase() === name,
  );

  if (!componentDocGens) {
    return null;
  }

  const componentDocGen = componentDocGens[0];

  if (!componentDocGen) {
    return null;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(componentDocGen.props).map(([key, prop]) => (
          <tr key={key}>
            <td>{prop.name}</td>
            <td>{prop.type.name}</td>
            <td>{prop.required ? "Yes" : "No"}</td>
            <td>{prop.defaultValue ? prop.defaultValue.value : "-"}</td>
            <td>{prop.description ? prop.description : "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
