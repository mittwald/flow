import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
import { getStates, getUsers, User } from "@/components/List/testData/userApi";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { usePromise } from "@mittwald/react-use-promise";
import { ListFilter, ListItemView, ListLoaderAsync } from "@/components/List";
import { AsyncDataLoader } from "@/components/List/model/loading/types";
import { getCompanies, getUsers, User } from "@/components/List/test/userApi";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { usePromise } from "@mittwald/react-use-promise";
import {
  ListFilter,
  ListItemView,
  ListLoaderAsync,
  ListSorting,
} from "@/components/List";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { Content } from "@/components/Content";
import { ItemContextMenu } from "@/components/List/components/Items/components/ItemContextMenu";
import { ContextMenuItem } from "@/components/ContextMenu";

const meta: Meta<typeof List> = {
  title: "Structure/List",
  component: List,
  render: () => {
    const loadUsers: AsyncDataLoader<User> = (opt) =>
      getUsers({
        pagination: opt?.pagination
          ? {
              limit: opt.pagination.limit,
              skip: opt.pagination.offset,
            }
          : undefined,
        filter: opt?.filtering?.["location.state"]
          ? {
              states: opt.filtering["location.state"].values as string[],
            }
          : undefined,
      });

    const availableStates = usePromise(getStates, []);

    return (
      <List>
        <ListLoaderAsync<User> manualPagination>{loadUsers}</ListLoaderAsync>
        <ListFilter<User>
          property="location.state"
          values={availableStates}
          mode="some"
        />
        <ListSorting<User> property="company" />
        <ListSorting<User> property="firstName" />
        <ListItemView<User>>
          {(user) => (
            <>
              <Avatar>
                <Initials>{`${user.firstName} ${user.lastName}`}</Initials>
              </Avatar>
              <Heading>
                {user.firstName} {user.lastName}
              </Heading>
              <Text>{user.company}</Text>
              <Content style={{ background: "lightgrey" }}></Content>
              <ItemContextMenu>
                <ContextMenuItem>Show details</ContextMenuItem>
                <ContextMenuItem>Delete</ContextMenuItem>
              </ItemContextMenu>
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
