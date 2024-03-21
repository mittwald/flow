import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
import { getStates, getUsers, User } from "@/components/List/testData/userApi";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { usePromise } from "@mittwald/react-use-promise";
import { ListFilter, ListItemView, ListLoaderAsync } from "@/components/List";
import { AsyncDataLoader } from "@/components/List/model/loading/types";

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
        <ListItemView<User>>
          {(user) => (
            <>
              <Heading>
                {user.name.first} {user.name.last} ({user.location.state})
              </Heading>
              <Text>{user.emails[0]}</Text>
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
