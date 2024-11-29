"use client";
import {
  List,
  ListItem,
  ListStaticData,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <List>
      <ListStaticData data={[{ foo: "bar" }]} />
      <ListItem></ListItem>
    </List>
  );
}
