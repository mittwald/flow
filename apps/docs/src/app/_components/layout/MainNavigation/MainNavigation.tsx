"use client";
import type { FC } from "react";
import { useMemo } from "react";
import {
  Header,
  Heading,
  Label,
  LayoutCard,
  Link,
  Navigation,
  NavigationGroup,
  Section,
  useModalController,
  useOnChange,
  Wrap,
} from "@mittwald/flow-react-components";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { ComponentStatusBadge } from "@/lib/componentStatus";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import type { MdxDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { buildDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.scss";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";
import { ComponentGroupingMenu } from "@/app/_components/layout/MainNavigation/components/ComponentGroupingMenu";
import { ComponentGroupingView } from "@/app/_components/ComponentGroupingView/ComponentGroupingView";
import type { SortableEntry } from "@/app/_lib/compareEntries";
import { compareEntries } from "@/app/_lib/compareEntries";
import { isIntegrationGroup } from "@/app/_lib/integrationGroups";
import {
  GroupExpansionProvider,
  useGroupExpansion,
} from "@/app/_components/layout/MainNavigation/components/GroupExpansion";
import { GroupExpansionButton } from "@/app/_components/layout/MainNavigation/components/GroupExpansionButton";

const componentsPathSegment = "04-components";

interface Props {
  docs: SerializedMdxFile[];
  mobileNavigation?: boolean;
}

interface NavigationSectionProps {
  tree: MdxDirectoryTree;
  group: string;
}

type TreeEntry = [string, MdxDirectoryTree | MdxFile];

interface NavigationLinkProps {
  treeItem: MdxFile;
}

const NavigationLink: FC<NavigationLinkProps> = (props) => {
  const { treeItem } = props;
  const currentPathname = usePathname();

  const overlay = useModalController();

  useOnChange(currentPathname, () => {
    overlay.close();
  }, [overlay]);

  const pathname = treeItem.pathname;

  const component = treeItem.mdxSource.frontmatter.component;

  return (
    <Link
      href={pathname}
      aria-current={pathname === currentPathname ? "page" : undefined}
    >
      {treeItem.getNavTitle()}
      {component && <ComponentStatusBadge name={component} />}
    </Link>
  );
};

const sortableEntry = ([group, treeItem]: TreeEntry): SortableEntry =>
  treeItem instanceof MdxFile
    ? {
        label: treeItem.getNavTitle(),
        pathSegment: group,
        component: treeItem.mdxSource.frontmatter.component,
      }
    : { label: extractTextFromPath(group), pathSegment: group };

const sortableFile = (treeItem: MdxFile): SortableEntry => ({
  label: treeItem.getNavTitle(),
  pathSegment: treeItem.slugs.at(-1) ?? "",
  component: treeItem.mdxSource.frontmatter.component,
});

const sortEntries = (entries: TreeEntry[]): TreeEntry[] =>
  [...entries].sort((a, b) =>
    compareEntries(sortableEntry(a), sortableEntry(b)),
  );

const collectMdxFiles = (entries: TreeEntry[]): MdxFile[] =>
  entries.flatMap(([, treeItem]) =>
    treeItem instanceof MdxFile
      ? [treeItem]
      : collectMdxFiles(Object.entries(treeItem)),
  );

const NavigationEntries: FC<{ entries: TreeEntry[] }> = (props) =>
  sortEntries(props.entries).map(([group, treeItem]) =>
    treeItem instanceof MdxFile ? (
      <NavigationLink key={treeItem.pathname} treeItem={treeItem} />
    ) : (
      <NavigationSection key={group} tree={treeItem} group={group} />
    ),
  );

const NavigationSection: FC<NavigationSectionProps> = (props) => {
  const { tree, group } = props;
  const groupExpansion = useGroupExpansion();
  const currentPathname = usePathname();

  const containsActivePage = collectMdxFiles(Object.entries(tree)).some(
    (treeItem) => treeItem.pathname === currentPathname,
  );

  const defaultExpanded = groupExpansion
    ? (groupExpansion.expandAll ?? containsActivePage)
    : undefined;

  return (
    // `defaultExpanded` only applies on mount, so the group is remounted
    // whenever the default it should follow changes.
    <NavigationGroup
      key={`${groupExpansion?.nonce}-${defaultExpanded}`}
      collapsable
      defaultExpanded={defaultExpanded}
    >
      <Label>
        <GroupText>{group}</GroupText>
      </Label>
      <NavigationEntries entries={Object.entries(tree)} />
    </NavigationGroup>
  );
};

const ComponentsNavigation: FC<{ tree: MdxDirectoryTree }> = (props) => {
  const entries = Object.entries(props.tree);
  const componentEntries = entries.filter(
    ([group]) => !isIntegrationGroup(group),
  );
  const integrationEntries = entries.filter(([group]) =>
    isIntegrationGroup(group),
  );

  return (
    <GroupExpansionProvider>
      <Section>
        <Header>
          <Heading>Components</Heading>
          <GroupExpansionButton />
          <ComponentGroupingMenu />
        </Header>
        <ComponentGroupingView view="grouped">
          <Navigation aria-label="Components">
            <NavigationEntries entries={componentEntries} />
          </Navigation>
        </ComponentGroupingView>
        <ComponentGroupingView view="alphabetical">
          <Navigation aria-label="Components">
            {collectMdxFiles(componentEntries)
              .sort((a, b) => compareEntries(sortableFile(a), sortableFile(b)))
              .map((treeItem) => (
                <NavigationLink key={treeItem.pathname} treeItem={treeItem} />
              ))}
          </Navigation>
        </ComponentGroupingView>
      </Section>
      <Section>
        <Heading>Integrations</Heading>
        <Navigation aria-label="Integrations">
          <NavigationEntries entries={integrationEntries} />
        </Navigation>
      </Section>
    </GroupExpansionProvider>
  );
};

const MainNavigation: FC<Props> = (props) => {
  const docs = props.docs.map(MdxFile.deserialize);
  const docsTree = useMemo(() => buildDirectoryTree(docs), [docs]);
  const currentPathname = usePathname();
  const mainPathSegment = currentPathname.split("/")[1];

  if (mainPathSegment === undefined) {
    return null;
  }

  const selectedMainBranch = docsTree[mainPathSegment];
  if (!selectedMainBranch || selectedMainBranch instanceof MdxFile) {
    return null;
  }

  return (
    <Wrap if={!props.mobileNavigation}>
      <LayoutCard className={styles.mainNavigation}>
        {mainPathSegment === componentsPathSegment ? (
          <ComponentsNavigation tree={selectedMainBranch} />
        ) : (
          <Section>
            <Navigation
              aria-label={extractTextFromPath(mainPathSegment)}
              key={mainPathSegment}
            >
              <NavigationEntries entries={Object.entries(selectedMainBranch)} />
            </Navigation>
          </Section>
        )}
      </LayoutCard>
    </Wrap>
  );
};

export default MainNavigation;
