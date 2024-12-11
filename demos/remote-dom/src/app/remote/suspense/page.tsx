"use client";
import {
  Button,
  Section,
  Suspense,
  TextField,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";
import { AsyncResource } from "@mittwald/react-use-promise";

const getDateNow = () =>
  new Promise<Date>((res) => setTimeout(() => res(new Date()), 1000));

const getDateNowResource = new AsyncResource(getDateNow);

const EnhancedDataComponent = () => {
  const now = getDateNowResource.use({
    keepValueWhileLoading: false,
  });

  const [buttonPressState, setButtonPressState] = useState(0);

  return (
    <Section>
      <Text>Promise data: {now.toLocaleString("de-DE")}</Text>
      <Button onPress={() => getDateNowResource.refresh()}>Reload</Button>
      <Button
        color="secondary"
        variant="soft"
        onPress={() => setButtonPressState((p) => p + 1)}
      >
        Button {buttonPressState}x clicked
      </Button>
      <TextField />
    </Section>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<Text>Loading....</Text>}>
      <EnhancedDataComponent />
    </Suspense>
  );
}
