import React from "react";
import styles from "./PropertiesTable.module.css";
import loadProperties from "@/lib/PropertiesTable/lib/loadProperties";
import { PropertyRow } from "@/lib/PropertiesTable/components/PropertyRow";

interface PropertiesTableProps {
  name: string;
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({ name }) => {
  const properties = loadProperties(name);

  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headline}>Property</th>
            <th className={styles.headline}>Type</th>
            <th className={styles.headline}>Default</th>
            <th className={styles.headline}>Description</th>
          </tr>
        </thead>
        <tbody>
          {properties?.other.map((prop) => (
            <PropertyRow property={prop} key={prop.name}></PropertyRow>
          ))}
        </tbody>
      </table>
      <details>
        <summary>Events</summary>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headline}>Property</th>
              <th className={styles.headline}>Type</th>
              <th className={styles.headline}>Default</th>
              <th className={styles.headline}>Description</th>
            </tr>
          </thead>
          <tbody>
            {properties?.events.map((prop) => (
              <PropertyRow property={prop} key={prop.name}></PropertyRow>
            ))}
          </tbody>
        </table>
      </details>
      <details>
        <summary>Accessibility</summary>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headline}>Property</th>
              <th className={styles.headline}>Type</th>
              <th className={styles.headline}>Default</th>
              <th className={styles.headline}>Description</th>
            </tr>
          </thead>
          <tbody>
            {properties?.accessibility.map((prop) => (
              <PropertyRow property={prop} key={prop.name}></PropertyRow>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
};

export default PropertiesTable;
