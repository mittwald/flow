import React from "react";
import styles from "../PropertiesTable.module.css";
import { PropertyGroup } from "../types";

export interface PropertyTableGroupProps {
  group: PropertyGroup;
}

export const PropertyTableGroup: React.FC<PropertyTableGroupProps> = ({
  group,
}) => {
  return (
    <>
      {group.properties.map((property, index) => (
        <tr key={index}>
          {index == 0 && (
            <th
              className={styles.groupHeadline}
              rowSpan={group.properties.length}
            >
              {group.name}
            </th>
          )}
          <td className={styles.col}>{property.name}</td>
          <td className={styles.col}>{property.type}</td>
          <td className={styles.col}>{property.required ? "Yes" : "No"}</td>
          <td className={styles.col}>{property.default ?? "-"}</td>
          <td className={styles.col}>{property.description ?? "-"}</td>
        </tr>
      ))}
    </>
  );
};
