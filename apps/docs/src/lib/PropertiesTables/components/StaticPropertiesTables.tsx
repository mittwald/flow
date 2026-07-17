import React from "react";
import type { Properties, Property } from "@/lib/PropertiesTables/types";

const formatDescription = (description: string | null | undefined): string =>
  (description ?? "")
    .replaceAll(/{@link (\S+) (.+?)}/g, "$2")
    .replaceAll(/{@link (\S+)}/g, "$1");

const StaticTable: React.FC<{ properties: Property[] }> = ({ properties }) => (
  <table aria-label="Properties" className="flow--table">
    <thead className="flow--table--header">
      <tr className="flow--table--row">
        <th className="flow--table--column">Property</th>
        <th className="flow--table--column">Type</th>
        <th className="flow--table--column">Default</th>
        <th className="flow--table--column">Description</th>
      </tr>
    </thead>
    <tbody className="flow--table--body">
      {properties.map((property) => (
        <tr className="flow--table--row" key={property.name}>
          <td className="flow--table--cell">
            <code>{property.name}</code>
            {property.required ? " (required)" : ""}
          </td>
          <td className="flow--table--cell">
            <code>{property.type}</code>
          </td>
          <td className="flow--table--cell">{property.default || "-"}</td>
          <td className="flow--table--cell">
            {formatDescription(property.description)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const StaticPropertiesTables: React.FC<{ properties: Properties }> = ({
  properties,
}) => (
  <>
    {properties.other.length > 0 && (
      <StaticTable properties={properties.other} />
    )}
    {properties.events.length > 0 && (
      <>
        <h3>Events</h3>
        <StaticTable properties={properties.events} />
      </>
    )}
    {properties.accessibility.length > 0 && (
      <>
        <h3>Accessibility</h3>
        <StaticTable properties={properties.accessibility} />
      </>
    )}
  </>
);
