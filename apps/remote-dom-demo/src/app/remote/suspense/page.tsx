"use client";
import {
  BrowserOnly,
  Button,
  Heading,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { getAsyncResource } from "@mittwald/react-use-promise";
import { type FC, Suspense, useState } from "react";

const getAsyncValue = (sleepMs: number) =>
  new Promise<number>((res) => {
    setTimeout(() => res(sleepMs), sleepMs);
  });

interface Props {
  sleepMs: number;
  foo: string;
}

const EnhancedDataComponent: FC<Props> = (props) => {
  const asyncResource = getAsyncResource(getAsyncValue, [props.sleepMs]);

  const value = asyncResource.use({
    keepValueWhileLoading: false,
  });

  const [buttonPressState, setButtonPressState] = useState(0);

  return (
    <Section>
      <Heading>{props.foo}</Heading>
      <Text>Promise WaitFor: {value} seconds</Text>
      <Button onPress={() => asyncResource.refresh()}>Reload</Button>
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

export default function Page() {
  return (
    <BrowserOnly>
      <Suspense fallback={<Heading>[Loading-1]</Heading>}>
        <EnhancedDataComponent foo="[Content-1]" sleepMs={1500} />
      </Suspense>
      <Suspense fallback={<Heading>[Loading-2]</Heading>}>
        <EnhancedDataComponent foo="[Content-2]" sleepMs={1100} />
      </Suspense>
      <Suspense fallback={<Heading>[Loading-3]</Heading>}>
        <EnhancedDataComponent foo="[Content-3]" sleepMs={1700} />
      </Suspense>
    </BrowserOnly>
  );
}
