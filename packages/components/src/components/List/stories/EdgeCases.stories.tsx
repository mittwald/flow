import type { Meta, StoryObj } from "@storybook/react";
import type List from "../List";
import React from "react";
import { Heading } from "~/components/Heading";
import { Text } from "~/components/Text";
import defaultMeta from "./Default.stories";
import { ListItemView, typedList } from "~/components/List";
import { Render } from "~/lib/react/components/Render";
import { usePromise } from "@mittwald/react-use-promise";

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
