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
      <Heading>Tunnel demo</Heading>
      <TunnelEntry id="remote-demo">
        <Button>
          <IconSearch />
        </Button>
      </TunnelEntry>
      <Content>
        <Text>
          See the <IconSearch size="s" /> in the menu
        </Text>
      </Content>
    </>
  );
}
