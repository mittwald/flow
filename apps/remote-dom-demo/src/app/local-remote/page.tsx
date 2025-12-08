"use client";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { Button } from "@mittwald/flow-remote-react-components";
import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";

const receiver = new RemoteReceiver();

export default function HostPage() {
  return (
    <>
      <RemoteRenderer __remoteReceiver={receiver} />
      <RemoteRoot __remoteReceiver={receiver}>
        <Button>Test</Button>
      </RemoteRoot>
    </>
  );
}
