"use client";

import {
  Avatar,
  Badge,
  BrowserOnly,
  Content,
  ContextMenu,
  Heading,
  Initials,
  ListItemView,
  MenuItem,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-remote-react-components";

interface Crew {
  id: string;
  name: string;
  role: string;
  status: string;
}

const crew: Crew[] = [
  { id: "1", name: "Luke Skywalker", role: "Jedi Master", status: "active" },
  { id: "2", name: "Leia Organa", role: "Rebel Pilot", status: "unavailable" },
  { id: "3", name: "Han Solo", role: "Smuggler", status: "active" },
];

export default function Page() {
  const List = typedList<Crew>();

  return (
    <BrowserOnly>
      <Section>
        <List.List
          aria-label="Crew"
          getItemId={(item) => item.id}
          selectedKeys={["2"]}
          selectionMode="multiple"
        >
          <List.StaticData data={crew} />
          <List.Filter property="role" name="Role" />
          <List.Sorting property="name" name="Alphabetical" defaultEnabled />
          <List.Item textValue={(item) => item.name}>
            {(item) => (
              <ListItemView>
                <Avatar>
                  <Initials>{item.name}</Initials>
                </Avatar>
                <Heading>
                  {item.name}
                  {item.status === "active" && <Badge>Active</Badge>}
                </Heading>
                <Text>{item.role}</Text>
                <Content>{item.role}</Content>
                <ContextMenu>
                  <MenuItem>Show details</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </ContextMenu>
              </ListItemView>
            )}
          </List.Item>
        </List.List>
      </Section>
      <Section>
        <Heading>Table view</Heading>
        <List.List
          defaultViewMode="table"
          aria-label="Crew table"
          getItemId={(item) => item.id}
          selectedKeys={["1", "2"]}
          selectionMode="multiple"
        >
          <List.StaticData data={crew} />
          <List.Table>
            <List.TableHeader>
              <List.TableColumn>Name</List.TableColumn>
              <List.TableColumn>Role</List.TableColumn>
            </List.TableHeader>
            <List.TableBody>
              <List.TableRow>
                <List.TableCell>{(item) => item.name}</List.TableCell>
                <List.TableCell>{(item) => item.role}</List.TableCell>
              </List.TableRow>
            </List.TableBody>
          </List.Table>
        </List.List>
      </Section>
    </BrowserOnly>
  );
}
