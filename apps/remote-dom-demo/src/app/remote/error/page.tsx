"use client";
import { Button, Section } from "@mittwald/flow-remote-react-components";
import { useState } from "react";

const Thrower = () => {
  throw new Error("Hyperdrive malfunction on the Millennium Falcon");
};

export default function Page() {
  const [renderThrower, setRenderThrower] = useState(false);
  return (
    <Section>
      {renderThrower && <Thrower />}
      <Button
        color="danger"
        onPress={() => {
          setRenderThrower(true);
        }}
      >
        Engage hyperdrive
      </Button>
    </Section>
  );
}
