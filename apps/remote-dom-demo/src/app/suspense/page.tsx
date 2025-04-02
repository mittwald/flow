"use client";
import {
  Button,
  Heading,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { type FC, Suspense, useState } from "react";
import { AsyncResource } from "@mittwald/react-use-promise";

const getAsyncValue = () =>
  new Promise<number>((res) => {
    const waitFor = (Math.floor(Math.random() * 10) + 1) * 1000;
    setTimeout(() => res(waitFor), waitFor);
  });

const EnhancedDataComponent = (foo = ""): FC => {
  const getDateNowResource = new AsyncResource(getAsyncValue);
  return () => {
    const value = getDateNowResource.use({
      keepValueWhileLoading: false,
    });

    const [buttonPressState, setButtonPressState] = useState(0);

    return (
      <Section>
        <Heading>{foo}</Heading>
        <Text>Promise WaitFor: {value} seconds</Text>
        <Button onPress={() => getDateNowResource.refresh()}>Reload</Button>
        <Button
          color="secondary"
          variant="soft"
          onPress={() => setButtonPressState((p) => p + 1)}
        >
          <Text>Button {buttonPressState}x clicked</Text>
        </Button>
        <TextField />
      </Section>
    );
  };
};

const Foo = EnhancedDataComponent("[Content-1]");
const Bar = EnhancedDataComponent("[Content-2]");
const Baz = EnhancedDataComponent("[Content-3]");

export default function Page() {
  return (
    <>
      <Suspense fallback={<Heading>[Loading-1]</Heading>}>
        <Foo />
      </Suspense>
      <Suspense fallback={<Heading>[Loading-2]</Heading>}>
        <Bar />
      </Suspense>
      <Suspense fallback={<Heading>[Loading-3]</Heading>}>
        <Baz />
      </Suspense>
    </>
  );
}
