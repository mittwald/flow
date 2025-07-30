import AlertBadge from "@/components/AlertBadge";
import { Avatar } from "@/components/Avatar";
import { Content } from "@/components/Content";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import { Heading } from "@/components/Heading";
import { Initials } from "@/components/Initials";
import { ListItemView, SortingFunctions, typedList } from "@/components/List";
import Section from "@/components/Section";
import { Text } from "@/components/Text";
import { IconDomain, IconSubdomain } from "@/index/flr-universal";
import { Render } from "@/lib/react/components/Render";
import { usePromise } from "@mittwald/react-use-promise";
import type { Meta, StoryObj } from "@storybook/react";
import type { SortingFn } from "@tanstack/react-table";
import type List from "../List";
import { domains } from "../testData/domainApi";
import defaultMeta from "./Default.stories";
import { Checkbox } from "@/components/Checkbox";

const meta: Meta<typeof List> = {
  ...defaultMeta,
  title: "Structure/List/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof List>;

const apiSleep = (): Promise<void> =>
  new Promise((res) => window.setTimeout(res, 2000));

const getEmail = async (name: string) => {
  await apiSleep();
  return `${name}@info.de`;
};

export const LoadingListItem: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List batchSize={5} aria-label="List">
        <List.StaticData data={[{ name: "John" }, { name: "Max" }]} />

        <List.Item textValue={(item) => item.name}>
          {(item) => (
            <Render>
              {() => {
                const email = usePromise(getEmail, [item.name]);

                return (
                  <ListItemView>
                    <Heading>{item.name}</Heading>
                    <Text>{email}</Text>
                  </ListItemView>
                );
              }}
            </Render>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const LoadingTile: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List defaultViewMode="tiles" batchSize={5} aria-label="List">
        <List.StaticData data={[{ name: "John" }, { name: "Max" }]} />

        <List.Item showTiles showList={false} textValue={(item) => item.name}>
          {(item) => (
            <Render>
              {() => {
                const email = usePromise(getEmail, [item.name]);

                return (
                  <ListItemView>
                    <Heading>{item.name}</Heading>
                    <Text>{email}</Text>
                  </ListItemView>
                );
              }}
            </Render>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const LoadingTableCell: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List batchSize={5} aria-label="List" defaultViewMode="table">
        <List.StaticData data={[{ name: "John" }, { name: "Max" }]} />

        <List.Table>
          <List.TableHeader>
            <List.TableColumn>Name</List.TableColumn>
            <List.TableColumn>Email</List.TableColumn>
          </List.TableHeader>

          <List.TableBody>
            <List.TableRow>
              <List.TableCell>{(item) => item.name}</List.TableCell>
              <List.TableCell>
                {(item) => (
                  <Render>
                    {() => {
                      return usePromise(getEmail, [item.name]);
                    }}
                  </Render>
                )}
              </List.TableCell>
            </List.TableRow>
          </List.TableBody>
        </List.Table>
      </List.List>
    );
  },
};

export const VeryLongWords: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item showTiles textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Checkbox aria-label="select user" />
              <Avatar>
                <Initials>{user.name}</Initials>
              </Avatar>
              <Heading>
                HeadingHeadingHeadingHeadingHeadingHeadingHeadingHeadingHeadingHeadingHeadingHeadingHeading
                <AlertBadge status="warning">
                  AlertBadgeAlertBadgeAlertBadgeAlertBadgeAlertBadgeAlertBadgeAlertBadgeAlertBadge
                </AlertBadge>
              </Heading>
              <Text>
                SubtitleSubtitleSubtitleSubtitleSubtitleSubtitleSubtitleSubtitleSubtitleSubtitleSubtitleSubtitle
              </Text>
              <Content slot="top">
                TopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTopTop
              </Content>
              <Content slot="bottom">
                BottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottomBottom
              </Content>
              <ContextMenu>
                <MenuItem>Show details</MenuItem>
              </ContextMenu>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

interface DomainWithBigIntId {
  id: bigint;
  hostname: string;
  tld: string;
  type: "Domain" | "Subdomain";
  verified: boolean;
}

const tldLengthSortingFn: SortingFn<DomainWithBigIntId> = (
  rowA,
  rowB,
  columnId,
) => {
  const tldA = String(rowA.getValue(columnId) || "");
  const tldB = String(rowB.getValue(columnId) || "");
  return tldA.length - tldB.length;
};

const domainTypeSortingFn: SortingFn<DomainWithBigIntId> = (
  rowA,
  rowB,
  columnId,
) => {
  const valueA = rowA.getValue(columnId);
  const valueB = rowB.getValue(columnId);

  if (valueA === "Domain" && valueB === "Subdomain") return -1;
  if (valueA === "Subdomain" && valueB === "Domain") return 1;

  return String(valueA).localeCompare(String(valueB));
};

export const CustomSortingList = () => {
  const domainsWithBigInt = domains.map((domain, index) => {
    const bigIntId = BigInt(1000000000000 + index);

    return {
      ...domain,
      id: bigIntId,
    };
  });

  const DomainList = typedList<DomainWithBigIntId>();

  const bigIntSorting =
    SortingFunctions.bigInt as SortingFn<DomainWithBigIntId>;

  return (
    <Section>
      <DomainList.List batchSize={10}>
        <DomainList.StaticData data={domainsWithBigInt} />

        <DomainList.Sorting
          property="hostname"
          name="Name A bis Z"
          direction="asc"
        />
        <DomainList.Sorting
          property="hostname"
          name="Name Z bis A"
          direction="desc"
        />

        <DomainList.Sorting
          property="id"
          name="ID (aufsteigend)"
          direction="asc"
          customSortingFn={bigIntSorting}
        />
        <DomainList.Sorting
          property="id"
          name="ID (absteigend)"
          direction="desc"
          customSortingFn={bigIntSorting}
          defaultEnabled
        />

        <DomainList.Sorting
          property="tld"
          name="TLD-Länge (kürzeste zuerst)"
          direction="asc"
          customSortingFn={tldLengthSortingFn}
        />
        <DomainList.Sorting
          property="tld"
          name="TLD-Länge (längste zuerst)"
          direction="desc"
          customSortingFn={tldLengthSortingFn}
        />

        <DomainList.Sorting
          property="type"
          name="Typ (Domains zuerst)"
          direction="asc"
          customSortingFn={domainTypeSortingFn}
        />

        <DomainList.Item>
          {(domain) => (
            <DomainList.ItemView>
              <Avatar color={domain.type === "Domain" ? "blue" : "teal"}>
                {domain.type === "Domain" ? <IconDomain /> : <IconSubdomain />}
              </Avatar>
              <Heading>
                {domain.hostname}
                {!domain.verified && (
                  <AlertBadge status="warning">Unverifiziert</AlertBadge>
                )}
              </Heading>
              <Text>{domain.type}</Text>
              <Text>ID: {domain.id}</Text>
              <Text>TLD: {domain.tld}</Text>
              <ContextMenu>
                <MenuItem>Details anzeigen</MenuItem>
                <MenuItem>Löschen</MenuItem>
              </ContextMenu>
            </DomainList.ItemView>
          )}
        </DomainList.Item>
      </DomainList.List>
    </Section>
  );
};
