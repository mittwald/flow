import type { FC } from "react";
import type { Property } from "../types";
import { TableCell, TableRow, Text } from "@mittwald/flow-react-components";
import { createCustomComponents } from "@/lib/mdx/components/MdxFileView/customComponents";
import Markdown from "react-markdown";
import { omit } from "remeda";
import { Badge } from "@mittwald/flow-react-components";
import { TypeValue } from "./TypeValue";
import styles from "../PropertiesTables.module.scss";

export interface PropertyTableGroupProps {
  property: Property;
}

export const PropertyRow: FC<PropertyTableGroupProps> = ({ property }) => {
  const formattedDescription = property.description
    ?.replaceAll(/{@link (\S+) (.+)}/g, "[$2]($1)")
    .replaceAll(/{@link (\S+)}/g, "[$1]($1)");

  const customComponents = createCustomComponents();

  return (
    <TableRow>
      <TableCell>
        <div className={styles.propertyCell}>
          <Text className={styles.propertyName}>
            <small>
              <strong>{property.name}</strong>
            </small>
          </Text>
          {property.required && <Badge>Required</Badge>}
        </div>
      </TableCell>
      <TableCell>
        <div className={styles.typeCell}>
          <TypeValue type={property.type} />
          {property.default && (
            <Text className={styles.defaultValue}>
              Default: {property.default}
            </Text>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Text elementType="div">
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
        </Text>
      </TableCell>
    </TableRow>
  );
};
