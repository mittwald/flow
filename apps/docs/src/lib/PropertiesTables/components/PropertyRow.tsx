import React from "react";
import type { Property } from "../types";
import { TableCell, TableRow } from "@mittwald/flow-react-components";
import { InlineCode } from "@mittwald/flow-react-components";
import { createCustomComponents } from "@/lib/mdx/components/MdxFileView/customComponents";
import Markdown from "react-markdown";
import { omit } from "remeda";
import { Badge } from "@mittwald/flow-react-components";

export interface PropertyTableGroupProps {
  property: Property;
}

export const PropertyRow: React.FC<PropertyTableGroupProps> = ({
  property,
}) => {
  const formattedDescription = property.description
    ?.replaceAll(/{@link (\S+) (.+)}/g, "[$2]($1)")
    .replaceAll(/{@link (\S+)}/g, "[$1]($1)");

  const customComponents = createCustomComponents();

  return (
    <TableRow>
      <TableCell>
        <InlineCode>{property.name}</InlineCode>
        {property.required && <Badge>Required</Badge>}
      </TableCell>
      <TableCell>{property.type}</TableCell>
      <TableCell>{property.default || "-"}</TableCell>
      <TableCell>
        <Markdown
          components={omit(customComponents, [
            "Content",
            "Heading",
            "Alert",
            "DoAndDont",
            "ColumnLayout",
          ])}
        >
          {formattedDescription}
        </Markdown>
      </TableCell>
    </TableRow>
  );
};
