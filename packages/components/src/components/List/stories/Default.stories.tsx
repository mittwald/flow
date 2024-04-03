import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { getStates, getUsers, User } from "@/components/List/testData/userApi";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { AsyncDataLoader } from "@/components/List/model/loading/types";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { ContextMenu, ContextMenuItem } from "@/components/ContextMenu";
import { Link } from "@/components/Link";
import { usePromise } from "@mittwald/react-use-promise";
import List, {
  ListFilter,
  ListItemView,
  ListLoaderAsync,
  ListSorting,
} from "@/components/List";

const loadUsers: AsyncDataLoader<User> = async (opt) => {
  const response = await getUsers({
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

  return {
    data: response.data,
    itemTotalCount: response.totalCount,
  };
};

const meta: Meta<typeof List> = {
  title: "Structure/List",
  component: List,
  render: () => {
    const availableStates = usePromise(getStates, []);

    return (
      <List>
        <ListLoaderAsync<User> manualPagination manualSorting={false}>
          {loadUsers}
        </ListLoaderAsync>
        <ListFilter<User>
          property="location.state"
          values={availableStates}
          mode="some"
          name="Location"
        />
        <ListSorting<User> property="location.state" name="Location" />
        <ListSorting<User> property="name.last" name="Last name" />
        <ListItemView<User>>
          {(user) => (
            <>
              <Avatar>
                <Initials>{`${user.name.first} ${user.name.last}`}</Initials>
              </Avatar>
              <Heading>
                {user.name.first} {user.name.last}
              </Heading>
              <Text>{user.location.state}</Text>
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
    const availableStates = usePromise(getStates, []);

    return (
      <List>
        <ListLoaderAsync<User> manualPagination>{loadUsers}</ListLoaderAsync>
        <ListFilter<User>
          property="location.state"
          values={availableStates}
          mode="some"
          name="Location"
        />
        <ListSorting<User> property="location.state" name="Location" />
        <ListSorting<User> property="name.last" name="Last name" />
        <ListItemView<User>>
          {(user) => (
            <Link href="#">
              <Avatar>
                <Initials>
                  {user.name.first} {user.name.last}
                </Initials>
              </Avatar>
              <Heading>
                {user.name.first} {user.name.last}
              </Heading>
              <Text>{user.location.state}</Text>
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
