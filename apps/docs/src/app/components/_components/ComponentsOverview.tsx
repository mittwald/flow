"use client";
import type { FC } from "react";
import { Heading, Section } from "@mittwald/flow-react-components";
import { groupBy } from "remeda";
import type { ComponentLink } from "@/app/components/_components/ComponentsList";
import { ComponentsList } from "@/app/components/_components/ComponentsList";
import { ComponentGroupingView } from "@/app/_components/ComponentGroupingView/ComponentGroupingView";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";
import { compareEntries } from "@/app/_lib/compareEntries";
import { isIntegrationGroup } from "@/app/_lib/integrationGroups";
import styles from "./ComponentsOverview.module.scss";

interface Props {
  components: ComponentLink[];
}

const componentsSection = "components";

const sortableComponent = (component: ComponentLink) => ({
  label: component.name,
  path: `/${componentsSection}/${component.group}/${component.slug}`,
  component: component.component,
});

const sortableGroup = (group: string) => ({
  label: extractTextFromPath(group),
  path: `/${componentsSection}/${group}`,
});

const toGroups = (components: ComponentLink[]): [string, ComponentLink[]][] =>
  Object.entries(groupBy(components, (c) => c.group)).sort(([a], [b]) =>
    compareEntries(sortableGroup(a), sortableGroup(b)),
  );

interface GroupSectionsProps extends Props {
  /** `Section` hands every heading level 2, so a nested group states its own. */
  headingLevel: 2 | 3;
}

const GroupSections: FC<GroupSectionsProps> = (props) =>
  toGroups(props.components).map(([group, groupComponents]) => (
    <Section key={group}>
      <Heading level={props.headingLevel}>{extractTextFromPath(group)}</Heading>
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
        <GroupSections components={components} headingLevel={2} />
      </ComponentGroupingView>
      <ComponentGroupingView view="alphabetical">
        <ComponentsList components={components} aria-label="Components" />
      </ComponentGroupingView>
      {integrations.length > 0 && (
        <Section className={styles.integrations}>
          <Heading>Integrations</Heading>
          <GroupSections components={integrations} headingLevel={3} />
        </Section>
      )}
    </>
  );
};

export default ComponentsOverview;
