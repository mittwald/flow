import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
import { getCompanies, getUsers, User } from "@/components/List/test/userApi";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { usePromise } from "@mittwald/react-use-promise";
import { ListFilter, ListItemView, ListLoaderAsync } from "@/components/List";

const meta: Meta<typeof List> = {
  title: "Structure/List",
  component: List,
  render: () => {
    return (
      <>
        <List>
          <ListLoaderAsync<User> manualPagination>{getUsers}</ListLoaderAsync>
          <ListFilter<User>
            property="company"
            values={usePromise(getCompanies, [])}
            mode="some"
          />
          <ListItemView<User>>
            {(user) => (
              <>
                <Heading>
                  {user.firstName} {user.lastName} ({user.company})
                </Heading>
                <Text>{user.email}</Text>
              </>
            )}
          </ListItemView>
        </List>
      </>
    );
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};
