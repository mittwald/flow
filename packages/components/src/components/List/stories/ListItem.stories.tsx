import type { Meta, StoryObj } from "@storybook/react";
import type List from "../List";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { ContextMenu, MenuItem } from "@/components/ContextMenu";
import defaultMeta from "./Default.stories";
import { Avatar } from "@/components/Avatar";
import { dummyText } from "@/lib/dev/dummyText";
import Image from "@/components/Image";
import { Content } from "@/components/Content";
import { AlertBadge } from "@/components/AlertBadge";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { IconClose, IconEmail } from "@/components/Icon/components/icons";
import { typedList } from "@/components/List";
import { ProgressBar } from "@/components/ProgressBar";
import { Label } from "@/components/Label";
import { Initials } from "@/components/Initials";
import { Checkbox } from "@/components/Checkbox";
import Section from "@/components/Section";

const meta: Meta<typeof List> = {
  ...defaultMeta,
  title: "Structure/List/ListItem",
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <Section>
        <List.List>
          <List.StaticData data={[{ name: "John Doe" }]} />
          <List.Item showTiles textValue={(user) => user.name}>
            {(user) => (
              <List.ItemView>
                <Avatar>
                  <Image alt={user.name} src={dummyText.imageSrc} />
                </Avatar>
                <Heading>
                  {user.name} <AlertBadge status="danger">Gesperrt</AlertBadge>
                </Heading>
                <Text>Mittwald</Text>
                <ContextMenu>
                  <MenuItem>Show details</MenuItem>
                </ContextMenu>
              </List.ItemView>
            )}
          </List.Item>
        </List.List>
      </Section>
    );
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {};

export const WithTopContent: Story = {
  render: () => {
    const List = typedList<{ mail: string }>();

    return (
      <List.List>
        <List.StaticData data={[{ mail: "john@doe.de" }]} />
        <List.Item showTiles textValue={(mail) => mail.mail}>
          {(mail) => (
            <List.ItemView>
              <Avatar>
                <IconEmail />
              </Avatar>
              <Heading>{mail.mail}</Heading>
              <Content>
                <ProgressBar value={50}>
                  <Label>Storage</Label>
                </ProgressBar>
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

export const WithBottomContent: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item showTiles textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Initials>{user.name}</Initials>
              </Avatar>
              <Heading>{user.name}</Heading>
              <Text>Mittwald</Text>
              <Content slot="bottom">
                <Text>{dummyText.long}</Text>
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

export const WithActionGroup: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item showTiles textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Image alt={user.name} src={dummyText.imageSrc} />
              </Avatar>
              <Heading>{user.name}</Heading>
              <Text>Mittwald</Text>
              <Content>
                <ActionGroup>
                  <Button color="secondary" variant="soft" slot="secondary">
                    Edit
                  </Button>
                  <Button color="danger" variant="soft">
                    Delete
                  </Button>
                </ActionGroup>
              </Content>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const WithMultipleTexts: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item showTiles textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Image alt={user.name} src={dummyText.imageSrc} />
              </Avatar>
              <Heading>{user.name}</Heading>
              <Text>Mittwald</Text>
              <Text>Development</Text>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const WithCustomTileMaxWidth: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List defaultViewMode="tiles">
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item tileMaxWidth={100} showTiles textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Image alt={user.name} src={dummyText.imageSrc} />
              </Avatar>
              <Heading>{user.name}</Heading>
              <Text>Mittwald</Text>
              <Text>Development</Text>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const WithHeadingAndAction: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Heading>{user.name}</Heading>
              <Button color="secondary" variant="plain" slot="secondary">
                <IconClose />
              </Button>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};

export const WithCheckbox: Story = {
  render: () => {
    const List = typedList<{ mail: string }>();

    return (
      <List.List>
        <List.StaticData data={[{ mail: "john@doe.de" }]} />
        <List.Table>
          <List.TableHeader>
            <List.TableColumn>
              <Checkbox aria-label="select all" />
            </List.TableColumn>
            <List.TableColumn>Mail address</List.TableColumn>
          </List.TableHeader>
          <List.TableBody>
            <List.TableRow>
              <List.TableCell>
                {() => <Checkbox aria-label="select address" />}
              </List.TableCell>
              <List.TableCell>{(mail) => mail.mail}</List.TableCell>
            </List.TableRow>
          </List.TableBody>
        </List.Table>
        <List.Item showTiles textValue={(mail) => mail.mail}>
          {(mail) => (
            <List.ItemView>
              <Checkbox aria-label="select address" />
              <Avatar>
                <IconEmail />
              </Avatar>
              <Heading>{mail.mail}</Heading>
              <Content>
                <ProgressBar value={50}>
                  <Label>Storage</Label>
                </ProgressBar>
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

export const WithColumnLayout: Story = {
  render: () => {
    const List = typedList<{ mail: string }>();

    return (
      <List.List>
        <List.StaticData
          data={[
            { mail: "john@doe.de" },
            { mail: "johnWithAVeryVeryLongEmailAddress@doe.de" },
          ]}
        />
        <List.Item textValue={(mail) => mail.mail}>
          {(mail) => (
            <List.ItemView l={[1, 1]} m={[2, 1]} s={[1, null]}>
              <Avatar>
                <IconEmail />
              </Avatar>
              <Heading>{mail.mail}</Heading>

              <Content>
                <ProgressBar value={50}>
                  <Label>Storage</Label>
                </ProgressBar>
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

export const WithAccordion: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <List.List accordion>
        <List.StaticData data={[{ name: "John Doe" }]} />
        <List.Item showTiles textValue={(user) => user.name}>
          {(user) => (
            <List.ItemView>
              <Avatar>
                <Image alt={user.name} src={dummyText.imageSrc} />
              </Avatar>
              <Heading>{user.name}</Heading>
              <Text>Mittwald</Text>
              <Content slot="bottom">
                <Text>{dummyText.long}</Text>
              </Content>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};
