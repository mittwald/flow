import type { FC } from "react";
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

export const PropertiesTable: FC<PropertiesTableProps> = ({ properties }) => {
  return (
    <Table aria-label="Properties" layout="fixed" minWidth={640}>
      <TableHeader>
        <TableColumn width="22%">Property</TableColumn>
        <TableColumn width="34%">Type</TableColumn>
        <TableColumn width="44%">Description</TableColumn>
      </TableHeader>
      <TableBody>
        {properties.map((prop) => (
          <PropertyRow property={prop} key={prop.name}></PropertyRow>
        ))}
      </TableBody>
    </Table>
  );
};
