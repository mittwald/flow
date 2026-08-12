"use client";
import type { FC } from "react";
import { Heading, Section } from "@mittwald/flow-react-components";
import { groupBy } from "remeda";
import type { ComponentLink } from "@/app/04-components/_components/ComponentsList";
import { ComponentsList } from "@/app/04-components/_components/ComponentsList";
import { useComponentGrouping } from "@/app/_lib/componentGrouping";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";

interface Props {
  components: ComponentLink[];
}

export const ComponentsOverview: FC<Props> = (props) => {
  const { components } = props;
  const { grouping } = useComponentGrouping();

  if (grouping === "alphabetical") {
    return <ComponentsList components={components} aria-label="Components" />;
  }

  const groups = Object.entries(groupBy(components, (c) => c.group)).sort(
    ([a], [b]) => a.localeCompare(b),
  );

  return groups.map(([group, groupComponents]) => (
    <Section key={group}>
      <Heading>{extractTextFromPath(group)}</Heading>
      <ComponentsList components={groupComponents} />
    </Section>
  ));
};

export default ComponentsOverview;
