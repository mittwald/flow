"use client";
import { Button } from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [pressCount, setPressCount] = useState(0);

  return (
    <Button
      onPress={(e) => {
        console.log(e);
        setPressCount((c) => c + 1);
      }}
      color="danger"
      variant="outline"
    >
      Pressed {pressCount}
    </Button>
  );
}
