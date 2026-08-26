"use client";
import type { FC } from "react";
import { typedList } from "@mittwald/flow-react-components";
import { ComponentCard } from "@/app/04-components/_components/ComponentCard";
import { deprecationRank } from "@/lib/componentStatus";

export interface ComponentLink {
  id: string;
  group: string;
  slug: string;
  name: string;
  /** Registry lookup key — the component's display name, from frontmatter. */
  component?: string;
  description?: string;
  href: string;
}

interface Props {
  components: ComponentLink[];
  "aria-label"?: string;
}

export const ComponentsList: FC<Props> = (props) => {
  // Deprecated components rank last, like they do in the navigation. The
  // incoming order is the tiebreaker, so grouped and alphabetical both keep it.
  const components = [...props.components].sort(
    (a, b) => deprecationRank(a.component) - deprecationRank(b.component),
  );

  const List = typedList<ComponentLink>();

  return (
    <List.List
      aria-label={props["aria-label"]}
      getItemId={(component) => component.id}
      defaultViewMode="tiles"
      batchSize={components.length}
      hidePagination
    >
      <List.StaticData data={components} />
      <List.Item
        href={(component) => component.href}
        textValue={(component) => component.name}
        showTiles
        showList={false}
        tileMaxWidth={250}
      >
        {(component) => <ComponentCard component={component} />}
      </List.Item>
    </List.List>
  );
};

export default ComponentsList;
