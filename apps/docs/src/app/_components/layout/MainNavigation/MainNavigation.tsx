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
import {
  ComponentStatusBadge,
  getComponentStatusInfo,
} from "@/lib/componentStatus";
import { GroupText } from "@/app/_components/layout/MainNavigation/components/GroupText";
import type { MdxDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { buildDirectoryTree } from "@/lib/mdx/components/buildDirectoryTree";
import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.scss";
import { extractTextFromPath } from "@/app/_lib/extractTextFromPath";
import { ComponentGroupingMenu } from "@/app/_components/layout/MainNavigation/components/ComponentGroupingMenu";
import { ComponentGroupingView } from "@/app/_components/ComponentGroupingView/ComponentGroupingView";
import { compareLabels } from "@/app/_lib/compareLabels";
import {
  GroupExpansionProvider,
  useGroupExpansion,
} from "@/app/_components/layout/MainNavigation/components/GroupExpansion";
import { GroupExpansionButton } from "@/app/_components/layout/MainNavigation/components/GroupExpansionButton";
import { isActiveDocsPage } from "@/app/_lib/isActiveDocsPage";

const componentsPathSegment = "04-components";

const integrationGroups = ["react-hook-form"];

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
  const isComponent = pathname.includes("04-components");

  const component = treeItem.mdxSource.frontmatter.component;

  return (
    <Link
      href={`${pathname}${isComponent ? "/overview" : ""}`}
      aria-current={
        isActiveDocsPage(pathname, currentPathname) ? "page" : undefined
      }
    >
      {treeItem.getNavTitle()}
      {component && <ComponentStatusBadge name={component} />}
    </Link>
  );
};

const deprecatedRank = (treeItem: MdxDirectoryTree | MdxFile): number => {
  if (!(treeItem instanceof MdxFile)) {
    return 0;
  }
  const component = treeItem.mdxSource.frontmatter.component;
  const status = component ? getComponentStatusInfo(component) : undefined;
  return status?.level === "deprecated" ? 1 : 0;
};

const entryLabel = ([group, treeItem]: TreeEntry): string =>
  treeItem instanceof MdxFile
    ? treeItem.getNavTitle()
    : extractTextFromPath(group);

/** A numeric path prefix ("01-design") is the author's intended order. */
const pathPrefix = ([group]: TreeEntry): number | undefined => {
  const prefix = /^(\d+)-/.exec(group)?.[1];
  return prefix === undefined ? undefined : Number(prefix);
};

const comparePosition = (a: TreeEntry, b: TreeEntry): number => {
  const prefixA = pathPrefix(a);
  const prefixB = pathPrefix(b);

  return prefixA !== undefined && prefixB !== undefined
    ? prefixA - prefixB
    : compareLabels(entryLabel(a), entryLabel(b));
};

const sortEntries = (entries: TreeEntry[]): TreeEntry[] =>
  [...entries].sort(
    (a, b) =>
      deprecatedRank(a[1]) - deprecatedRank(b[1]) || comparePosition(a, b),
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
    (treeItem) => isActiveDocsPage(treeItem.pathname, currentPathname),
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
    ([group]) => !integrationGroups.includes(group),
  );
  const integrationEntries = entries.filter(([group]) =>
    integrationGroups.includes(group),
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
              .sort((a, b) => compareLabels(a.getNavTitle(), b.getNavTitle()))
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
