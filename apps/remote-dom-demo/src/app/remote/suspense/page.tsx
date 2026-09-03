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
  label: string;
}

const EnhancedDataComponent: FC<Props> = (props) => {
  const asyncResource = getAsyncResource(getAsyncValue, [props.sleepMs]);

  const value = asyncResource.use({
    keepValueWhileLoading: false,
  });

  const [buttonPressState, setButtonPressState] = useState(0);

  return (
    <Section>
      <Heading>{props.label}</Heading>
      <Text>Reached in {value} seconds</Text>
      <Button onPress={() => asyncResource.refresh()}>Reconnect</Button>
      <Button
        color="secondary"
        variant="soft"
        onPress={() => setButtonPressState((p) => p + 1)}
      >
        <Text>Pinged {buttonPressState}x</Text>
      </Button>
      <TextField aria-label="Outpost name" />
    </Section>
  );
};

export default function Page() {
  return (
    <BrowserOnly>
      <Suspense fallback={<Heading>Contacting Tatooine…</Heading>}>
        <EnhancedDataComponent label="Tatooine outpost" sleepMs={1500} />
      </Suspense>
      <Suspense fallback={<Heading>Contacting Hoth…</Heading>}>
        <EnhancedDataComponent label="Hoth outpost" sleepMs={1100} />
      </Suspense>
      <Suspense fallback={<Heading>Contacting Endor…</Heading>}>
        <EnhancedDataComponent label="Endor outpost" sleepMs={1700} />
      </Suspense>
    </BrowserOnly>
  );
}
