"use client";
import {
  Button,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";
import { Suspense, useState } from "react";
import { AsyncResource } from "@mittwald/react-use-promise";

const getAsyncValue = () =>
  new Promise<number>((res) => setTimeout(() => res(42), 2000));

const getDateNowResource = new AsyncResource(getAsyncValue);

const EnhancedDataComponent = () => {
  const value = getDateNowResource.use({
    keepValueWhileLoading: false,
  });

  const [buttonPressState, setButtonPressState] = useState(0);

  return (
    <>
      <Text>Promise data: {value}</Text>
      <Button onPress={() => getDateNowResource.refresh()}>Reload</Button>
      <Button
        color="secondary"
        variant="soft"
        onPress={() => setButtonPressState((p) => p + 1)}
      >
        Button {buttonPressState}x clicked
      </Button>
      <TextField />
    </>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<Text>Loading....</Text>}>
      <Section>
        <EnhancedDataComponent />
      </Section>
    </Suspense>
  );
}
