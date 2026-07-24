"use client";
import type { FC } from "react";
import { Heading, Text, typedList } from "@mittwald/flow-react-components";

export interface ComponentLink {
  id: string;
  name: string;
  description?: string;
  href: string;
}

interface Props {
  components: ComponentLink[];
}

export const ComponentsList: FC<Props> = (props) => {
  const { components } = props;

  const List = typedList<ComponentLink>();

  return (
    <List.List
      aria-label="Components"
      getItemId={(component) => component.id}
      batchSize={components.length}
      hidePagination
    >
      <List.StaticData data={components} />
      <List.Item
        href={(component) => component.href}
        textValue={(component) => component.name}
      >
        {(component) => (
          <List.ItemView>
            <Heading>{component.name}</Heading>
            {component.description && <Text>{component.description}</Text>}
          </List.ItemView>
        )}
      </List.Item>
    </List.List>
  );
};

export default ComponentsList;
