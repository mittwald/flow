import type { FC } from "react";
import type { Properties, Property } from "@/lib/PropertiesTables/types";
import { TypeValue } from "./TypeValue";
import styles from "../PropertiesTables.module.scss";

const formatDescription = (description: string | null | undefined): string =>
  (description ?? "")
    .replaceAll(/{@link (\S+) (.+?)}/g, "$2")
    .replaceAll(/{@link (\S+)}/g, "$1");

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
        <tr className="flow--table--row" key={property.name}>
          <td className="flow--table--cell">
            <div className={styles.propertyCell}>
              <code className={`flow--inline-code ${styles.propertyName}`}>
                {property.name}
              </code>
              {property.required ? " (required)" : ""}
            </div>
          </td>
          <td className="flow--table--cell">
            <div className={styles.typeCell}>
              <TypeValue type={property.type} />
              {property.default && (
                <span className={styles.defaultValue}>
                  Default: {property.default}
                </span>
              )}
            </div>
          </td>
          <td className="flow--table--cell">
            {formatDescription(property.description)}
          </td>
        </tr>
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
