import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { usePromise } from "@mittwald/react-use-promise";
import { ListItem, ListItemView, ListLoaderAsync } from "@/components/List";
import type { AsyncDataLoader } from "@/components/List/model/loading/types";
import { Avatar } from "@/components/Avatar";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import { IconDomain, IconSubdomain } from "@/components/Icon/components/icons";
import StatusBadge from "@/components/StatusBadge";
import type { Domain } from "../testData/domainApi";
import { getDomains, getTypes } from "../testData/domainApi";
import { typedList } from "@/components/List/typedList";

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

    const Domains = typedList<Domain>();

    return (
      <Domains.List batchSize={5}>
        <Domains.LoaderAsync manualPagination manualSorting={false}>
          {loadDomains}
        </Domains.LoaderAsync>
        <Domains.Filter
          values={availableTypes}
          property="type"
          mode="all"
          name="Typ"
        />
        <Domains.Sorting property="domain" name="A-Z" />
        <Domains.Sorting property="domain" name="Z-A" direction="desc" />
        <Domains.Sorting property="type" name="Typ" defaultEnabled />
        <Domains.Sorting property="tld" name="TLD" />
        <Domains.ItemView>
          {(domain) => (
            <ListItem>
              <Avatar variant={domain.type === "Domain" ? 1 : 2}>
                {domain.type === "Domain" ? <IconDomain /> : <IconSubdomain />}
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
            </ListItem>
          )}
        </Domains.ItemView>
      </Domains.List>
    );
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};

export const ItemsWithLink: Story = {
  render: () => {
    return (
      <List batchSize={5}>
        <ListLoaderAsync<Domain> manualPagination>
          {loadDomains}
        </ListLoaderAsync>
        <ListItemView<Domain>>
          {(domain) => (
            <ListItem href="#">
              <Avatar variant={domain.type === "Domain" ? 1 : 2}>
                {domain.type === "Domain" ? <IconDomain /> : <IconSubdomain />}
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
            </ListItem>
          )}
        </ListItemView>
      </List>
    );
  },
};
