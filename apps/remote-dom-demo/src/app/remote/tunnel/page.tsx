"use client";
import {
  Button,
  Content,
  Heading,
  IconSearch,
  Text,
  TunnelEntry,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <>
      <Heading>Fleet search</Heading>
      <TunnelEntry id="remote-demo">
        <Button>
          <IconSearch />
        </Button>
      </TunnelEntry>
      <Content>
        <Text>
          Find the <IconSearch size="s" /> in the menu to search the fleet
        </Text>
      </Content>
    </>
  );
}
