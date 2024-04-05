import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { usePromise } from "@mittwald/react-use-promise";
import {
  ListFilter,
  ListItemView,
  ListLoaderAsync,
  ListSorting,
} from "@/components/List";
import type { AsyncDataLoader } from "@/components/List/model/loading/types";
import { Avatar } from "@/components/Avatar";
import { ContextMenu, ContextMenuItem } from "@/components/ContextMenu";
import { Link } from "@/components/Link";
import { IconDomain, IconSubdomain } from "@/components/Icon/components/icons";
import StatusBadge from "@/components/StatusBadge";
import type { Domain } from "../testData/domainApi";
import { getDomains, getTypes } from "../testData/domainApi";

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

    return (
      <List batchSize={5}>
        <ListLoaderAsync<Domain> manualPagination manualSorting={false}>
          {loadDomains}
        </ListLoaderAsync>
        <ListFilter<Domain>
          property="type"
          values={availableTypes}
          mode="some"
          name="Type"
        />
        <ListSorting<Domain> property="domain" name="Domain" />
        <ListSorting<Domain> property="type" name="Type" />
        <ListItemView<Domain>>
          {(domain) => (
            <>
              <Avatar>
                {domain.type === "Domain" ? <IconDomain /> : <IconSubdomain />}
              </Avatar>
              <Heading>{domain.hostname}</Heading>
              {domain.verified ? (
                <Text>{domain.type}</Text>
              ) : (
                <StatusBadge status="warning">Not verified</StatusBadge>
              )}

              <ContextMenu>
                <ContextMenuItem>Show details</ContextMenuItem>
                <ContextMenuItem>Delete</ContextMenuItem>
              </ContextMenu>
            </>
          )}
        </ListItemView>
      </List>
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
            <Link href="#">
              <Avatar>
                {domain.type === "Domain" ? <IconDomain /> : <IconSubdomain />}
              </Avatar>
              <Heading>{domain.hostname}</Heading>
              <Text>{domain.type}</Text>
              <ContextMenu>
                <ContextMenuItem>Show details</ContextMenuItem>
                <ContextMenuItem>Delete</ContextMenuItem>
              </ContextMenu>
            </Link>
          )}
        </ListItemView>
      </List>
    );
  },
};
