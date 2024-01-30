import React from "react";
import styles from "./PropertyRow.module.css";
import { Property } from "@/lib/PropertiesTable/types";

export interface PropertyTableGroupProps {
  property: Property;
}

export const PropertyRow: React.FC<PropertyTableGroupProps> = ({
  property,
}) => {
  return (
    <>
      <tr>
        <td width="10%">
          <span className={styles.colName}>{property.name}</span>
          <span className={styles.colNameOptional}>
            {!property.required && "?"}
          </span>
        </td>
        <td width="10%">{property.type}</td>
        <td width="5%" className={styles.colDefault}>
          {property.default ?? "-"}
        </td>
        <td>{property.description ?? "-"}</td>
      </tr>
    </>
  );
};
