"use client";
import { Button } from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [clicks, setClicks] = useState(0);
  return (
    <Button
      color="primary"
      onPress={() => {
        console.log("Clicked");
        setClicks((c) => c + 1);
      }}
    >
      Clicked ({clicks})
    </Button>
  );
}
