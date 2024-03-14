import type { Meta, StoryObj } from "@storybook/react";
import List from "../List";
import React from "react";
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
    return (
      <>
        <List>
          <ListLoaderAsync<User> manualPagination>{getUsers}</ListLoaderAsync>
          <ListFilter<User>
            property="company"
            values={usePromise(getCompanies, [])}
            mode="some"
          />
          <ListSorting<User> property="company" />
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
      </>
    );
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};
