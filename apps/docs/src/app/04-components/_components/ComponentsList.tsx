"use client";
import type { FC } from "react";
import { typedList } from "@mittwald/flow-react-components";
import { ComponentCard } from "@/app/04-components/_components/ComponentCard";

export interface ComponentLink {
  id: string;
  slug: string;
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
      defaultViewMode="tiles"
      batchSize={components.length}
      hidePagination
    >
      <List.Search />
      <List.StaticData data={components} />
      <List.Item
        href={(component) => component.href}
        textValue={(component) => component.name}
        showTiles
        showList={false}
        tileMaxWidth={280}
      >
        {(component) => <ComponentCard component={component} />}
      </List.Item>
    </List.List>
  );
};

export default ComponentsList;
