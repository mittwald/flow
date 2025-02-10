import React from "react";
import { PropertyRow } from "./PropertyRow";
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
} from "@mittwald/flow-react-components";
import type { Property } from "@/lib/PropertiesTables/types";

interface PropertiesTableProps {
  properties: Property[];
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  properties,
}) => {
  return (
    <>
      <Table aria-label="Properties">
        <TableHeader>
          <TableColumn>Property</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Default</TableColumn>
          <TableColumn>Description</TableColumn>
        </TableHeader>
        <TableBody>
          {properties.map((prop) => (
            <PropertyRow property={prop} key={prop.name}></PropertyRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
