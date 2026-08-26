"use client";
import type { FC } from "react";
import { Heading, Section } from "@mittwald/flow-react-components";
import { groupBy } from "remeda";
import type { ComponentLink } from "@/app/04-components/_components/ComponentsList";
import { ComponentsList } from "@/app/04-components/_components/ComponentsList";
import { ComponentGroupingView } from "@/app/_components/ComponentGroupingView/ComponentGroupingView";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";
import { compareGroupPaths, compareLabels } from "@/app/_lib/compareLabels";
import { compareDeprecatedLast } from "@/lib/componentStatus";

interface Props {
  components: ComponentLink[];
}

/** Mirrors the navigation's order: deprecated last, then by label. */
const compareComponents = (a: ComponentLink, b: ComponentLink): number =>
  compareDeprecatedLast(a.component, b.component) ||
  compareLabels(a.name, b.name);

export const ComponentsOverview: FC<Props> = (props) => {
  const components = [...props.components].sort(compareComponents);

  const groups = Object.entries(groupBy(components, (c) => c.group)).sort(
    ([a], [b]) => compareGroupPaths(a, b),
  );

  return (
    <>
      <ComponentGroupingView view="grouped">
        {groups.map(([group, groupComponents]) => (
          <Section key={group}>
            <Heading>{extractTextFromPath(group)}</Heading>
            <ComponentsList components={groupComponents} />
          </Section>
        ))}
      </ComponentGroupingView>
      <ComponentGroupingView view="alphabetical">
        <ComponentsList components={components} aria-label="Components" />
      </ComponentGroupingView>
    </>
  );
};

export default ComponentsOverview;
