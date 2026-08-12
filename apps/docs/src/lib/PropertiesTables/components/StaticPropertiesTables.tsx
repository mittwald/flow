import type { FC } from "react";
import type { Properties, Property } from "@/lib/PropertiesTables/types";
import { formatType } from "@/lib/PropertiesTables/lib/unionType";
import { TypeValue } from "./TypeValue";
import styles from "../PropertiesTables.module.scss";

const formatDescription = (description: string | null | undefined): string =>
  (description ?? "")
    .replaceAll(/{@link (\S+) (.+?)}/g, "$2")
    .replaceAll(/{@link (\S+)}/g, "$1");

const StaticRow: FC<{ property: Property }> = ({ property }) => {
  const type = formatType(property.type, property.default);

  return (
    <tr className="flow--table--row">
      <td className="flow--table--cell">
        <div className={styles.propertyCell}>
          <code className="flow--inline-code">{property.name}</code>
          {property.required ? " (required)" : ""}
        </div>
      </td>
      <td className="flow--table--cell">
        <div className={styles.typeCell}>
          <span className={styles.type}>
            <TypeValue {...type} />
          </span>
          {property.default && !type.includesDefault && (
            <span className={styles.defaultValue}>
              default: {property.default}
            </span>
          )}
        </div>
      </td>
      <td className="flow--table--cell">
        {formatDescription(property.description)}
      </td>
    </tr>
  );
};

const StaticTable: FC<{ properties: Property[] }> = ({ properties }) => (
  <table aria-label="Properties" className="flow--table">
    <thead className="flow--table--header">
      <tr className="flow--table--row">
        <th className="flow--table--column">Property</th>
        <th className="flow--table--column">Type</th>
        <th className="flow--table--column">Description</th>
      </tr>
    </thead>
    <tbody className="flow--table--body">
      {properties.map((property) => (
        <StaticRow property={property} key={property.name} />
      ))}
    </tbody>
  </table>
);

export const StaticPropertiesTables: FC<{ properties: Properties }> = ({
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
