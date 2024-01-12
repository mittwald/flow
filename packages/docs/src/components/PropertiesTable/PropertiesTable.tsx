import React from "react";
import styles from "./PropertiesTable.module.css";
import loadProperties from "@/components/PropertiesTable/lib/loadProperties";
import { PropertyTableGroup } from "@/components/PropertiesTable/components/PropertyTableGroup";

interface PropertiesTableProps {
  name: string;
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({ name }) => {
  const properties = loadProperties(name);

  return (
    <table className={styles.root}>
      <thead>
        <tr>
          <th className={styles.headline}>Source</th>
          <th className={styles.headline}>Property</th>
          <th className={styles.headline}>Type</th>
          <th className={styles.headline}>Required</th>
          <th className={styles.headline}>Default</th>
          <th className={styles.headline}>Description</th>
        </tr>
      </thead>
      <tbody>
        {properties?.map((group) => (
          <PropertyTableGroup
            group={group}
            key={group.name}
          ></PropertyTableGroup>
        ))}
      </tbody>
    </table>
  );
};
