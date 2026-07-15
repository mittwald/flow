"use client";
import { Button, Section, Text } from "@mittwald/flow-remote-react-components";
import { createElement, useState } from "react";

export default function Page() {
  const [renderUnknown, setRenderUnknown] = useState(false);

  return (
    <Section>
      <Text>
        Renders a remote element with a tag the host cannot map, triggering the
        &quot;No component found for remote element&quot; error. The host holds
        the error back until it has been delivered to the remote, then re-throws
        it. The error therefore surfaces on both sides.
      </Text>
      {renderUnknown &&
        createElement("flr-unknown-component", {}, "unknown component")}
      <Button color="danger" onPress={() => setRenderUnknown(true)}>
        Render unknown component
      </Button>
    </Section>
  );
}
