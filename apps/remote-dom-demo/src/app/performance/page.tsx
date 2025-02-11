"use client";
import { useEffect, useState } from "react";
import {
  Alert,
  Section,
  TextField,
  Heading,
  Text,
  Button,
} from "@mittwald/flow-remote-react-components";
import React from "react";

export default function Page() {
  const [elemCount, setElemCount] = useState(100);
  const [showElem, setShowElems] = useState(true);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setTicker((cur) => cur + 1);
    }, 500);
    return () => {
      clearInterval(i);
    };
  }, []);

  return (
    <Section>
      <TextField onChange={(val) => setElemCount(Number.parseInt(val))} />
      <Button onPress={() => setShowElems((show) => !show)}>Toggle</Button>
      {isNaN(elemCount) || !showElem
        ? null
        : Array(elemCount)
            .fill(0)
            .map((_, index) => (
              <Alert key={index}>
                <Heading>Alert title</Heading>
                <Text>Alert text {ticker}</Text>
              </Alert>
            ))}
    </Section>
  );
}
