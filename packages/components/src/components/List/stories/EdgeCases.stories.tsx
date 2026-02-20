import AlertBadge from "@/components/AlertBadge";
import { Avatar } from "@/components/Avatar";
import { Content } from "@/components/Content";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import { Heading } from "@/components/Heading";
import { Initials } from "@/components/Initials";
import { SortingFunctions, typedList } from "@/components/List";
import { Text } from "@/components/Text";
import { IconDomain, IconSubdomain } from "@/components/Icon/components/icons";
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

export const VeryLongWords: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List aria-label="List">
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

export const CustomSorting = () => {
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
    <DomainList.List batchSize={10} aria-label="Domains">
      <DomainList.StaticData data={domainsWithBigInt} />

      <DomainList.Sorting
        property="hostname"
        name="Hostname"
        direction="asc"
        directionName="ascending"
      />
      <DomainList.Sorting
        property="hostname"
        name="Hostname"
        direction="desc"
        directionName="descending"
      />

      <DomainList.Sorting
        property="id"
        name="ID"
        direction="asc"
        customSortingFn={bigIntSorting}
        directionName="ascending"
      />
      <DomainList.Sorting
        property="id"
        name="ID"
        direction="desc"
        customSortingFn={bigIntSorting}
        defaultEnabled
        directionName="descending"
      />

      <DomainList.Sorting
        property="tld"
        name="TLD length"
        direction="asc"
        customSortingFn={tldLengthSortingFn}
        directionName="shortest first"
      />
      <DomainList.Sorting
        property="tld"
        name="TLD length"
        direction="desc"
        customSortingFn={tldLengthSortingFn}
        directionName="longest first"
      />

      <DomainList.Sorting
        property="type"
        name="Type"
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
                <AlertBadge status="warning">Unverified</AlertBadge>
              )}
            </Heading>
            <Text>{domain.type}</Text>
            <Text>ID: {domain.id}</Text>
            <Text>TLD: {domain.tld}</Text>
            <ContextMenu>
              <MenuItem>Show details</MenuItem>
              <MenuItem>Delete</MenuItem>
            </ContextMenu>
          </DomainList.ItemView>
        )}
      </DomainList.Item>
    </DomainList.List>
  );
};
