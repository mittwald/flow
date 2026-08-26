"use client";
import type { FC } from "react";
import { Heading, Section } from "@mittwald/flow-react-components";
import { groupBy } from "remeda";
import type { ComponentLink } from "@/app/04-components/_components/ComponentsList";
import { ComponentsList } from "@/app/04-components/_components/ComponentsList";
import { ComponentGroupingView } from "@/app/_components/ComponentGroupingView/ComponentGroupingView";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";
import { compareEntries } from "@/app/_lib/compareEntries";
import { isIntegrationGroup } from "@/app/_lib/integrationGroups";

interface Props {
  components: ComponentLink[];
}

const sortableComponent = (component: ComponentLink) => ({
  label: component.name,
  pathSegment: component.slug,
  component: component.component,
});

const sortableGroup = (group: string) => ({
  label: extractTextFromPath(group),
  pathSegment: group,
});

const toGroups = (components: ComponentLink[]): [string, ComponentLink[]][] =>
  Object.entries(groupBy(components, (c) => c.group)).sort(([a], [b]) =>
    compareEntries(sortableGroup(a), sortableGroup(b)),
  );

const GroupSections: FC<Props> = (props) =>
  toGroups(props.components).map(([group, groupComponents]) => (
    <Section key={group}>
      <Heading>{extractTextFromPath(group)}</Heading>
      <ComponentsList components={groupComponents} />
    </Section>
  ));

export const ComponentsOverview: FC<Props> = (props) => {
  const sorted = [...props.components].sort((a, b) =>
    compareEntries(sortableComponent(a), sortableComponent(b)),
  );
  const components = sorted.filter((c) => !isIntegrationGroup(c.group));
  const integrations = sorted.filter((c) => isIntegrationGroup(c.group));

  return (
    <>
      <ComponentGroupingView view="grouped">
        <GroupSections components={components} />
      </ComponentGroupingView>
      <ComponentGroupingView view="alphabetical">
        <ComponentsList components={components} aria-label="Components" />
      </ComponentGroupingView>
      {integrations.length > 0 && (
        <Section>
          <Heading>Integrations</Heading>
          <GroupSections components={integrations} />
        </Section>
      )}
    </>
  );
};

export default ComponentsOverview;
