"use client";
import { Button, Section } from "@mittwald/flow-remote-react-components";
import { useState } from "react";

const Thrower = () => {
  throw new Error("Something went wrong");
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
        Trigger error
      </Button>
    </Section>
  );
}
