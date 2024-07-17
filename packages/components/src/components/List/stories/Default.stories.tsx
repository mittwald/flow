import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { usePromise } from "@mittwald/react-use-promise";
import type { AsyncDataLoader } from "@/components/List/model/loading/types";
import { Avatar } from "@/components/Avatar";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import { IconDomain, IconSubdomain } from "@/components/Icon/components/icons";
import StatusBadge from "@/components/StatusBadge";
import type { Domain } from "../testData/domainApi";
import { getDomains, getTypes } from "../testData/domainApi";
import { Section } from "@/components/Section";
import { typedList } from "@/components/List";

const loadDomains: AsyncDataLoader<Domain> = async (opt) => {
  const response = await getDomains({
    pagination: opt?.pagination
      ? {
          limit: opt.pagination.limit,
          skip: opt.pagination.offset,
        }
      : undefined,
    filter: opt?.filtering?.["type"]
      ? {
          types: opt.filtering["type"].values as string[],
        }
      : undefined,
    search: opt?.searchString,
  });

  return {
    data: response.data,
    itemTotalCount: response.totalCount,
  };
};

const meta: Meta<typeof List> = {
  title: "Structure/List",
  component: List,
  render: () => {
    const availableTypes = usePromise(getTypes, []);

    const DomainList = typedList<Domain>();

    return (
      <Section>
        <Heading>Domains</Heading>
        <DomainList.List batchSize={5}>
          <DomainList.LoaderAsync manualPagination manualSorting={false}>
            {loadDomains}
          </DomainList.LoaderAsync>
          <DomainList.Filter
            values={availableTypes}
            property="type"
            mode="all"
            name="Typ"
          />
          <DomainList.Search autoFocus />
          <DomainList.Sorting property="domain" name="A-Z" />
          <DomainList.Sorting property="domain" name="Z-A" direction="desc" />
          <DomainList.Sorting property="type" name="Typ" defaultEnabled />
          <DomainList.Sorting property="tld" name="TLD" />
          <DomainList.Item
            textValue={(domain) => domain.hostname}
            onAction={(domain) => console.log(domain.hostname)}
          >
            {(domain) => (
              <DomainList.ItemView>
                <Avatar variant={domain.type === "Domain" ? 1 : 2}>
                  {domain.type === "Domain" ? (
                    <IconDomain />
                  ) : (
                    <IconSubdomain />
                  )}
                </Avatar>
                <Heading>
                  {domain.hostname}
                  {!domain.verified && (
                    <StatusBadge status="warning">Not verified</StatusBadge>
                  )}
                </Heading>
                <Text>{domain.type}</Text>

                <ContextMenu>
                  <MenuItem>Show details</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </ContextMenu>
              </DomainList.ItemView>
            )}
          </DomainList.Item>
        </DomainList.List>
      </Section>
    );
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};
