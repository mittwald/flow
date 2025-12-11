import RemoteRoot from "@/components/RemoteRoot";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { render } from "vitest-browser-react";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { type Locator } from "vitest/browser";
import * as RemoteComponents from "@/index";
import * as Components from "@mittwald/flow-react-components";
import { useMemo, type FC, type PropsWithChildren } from "react";
import { RootContainer, rootContainerLocator } from "@/tests/lib/RootContainer";
import { sleep } from "@/tests/lib/sleep";

const RemoteTestUi: FC<PropsWithChildren> = (props) => {
  const receiver = useMemo(() => new RemoteReceiver(), []);

  return (
    <RootContainer>
      <RemoteRenderer __remoteReceiver={receiver} />
      <RemoteRoot __remoteReceiver={receiver}>{props.children}</RemoteRoot>
    </RootContainer>
  );
};

export const renderRemote: typeof render = async (ui, options) => {
  const result = await render(<RemoteTestUi>{ui}</RemoteTestUi>, options);
  await prepareScreenshot();
  return result;
};

export const renderLocal: typeof render = async (ui, options) => {
  const result = await render(<RootContainer>{ui}</RootContainer>, options);
  await prepareScreenshot();
  return result;
};

const prepareScreenshot = async (): Promise<void> => {
  // Move the mouse to somewhere neutral to avoid hover effects
  await rootContainerLocator.unhover();
  await sleep(50);
};

interface TestEnvironement {
  toString: () => string;
  components: typeof Components | typeof RemoteComponents;
  render: typeof render;
  container: Locator;
  prepareScreenshot: () => Promise<void>;
}

const remoteTestEnvironement: TestEnvironement = {
  toString: () => "Remote",
  components: RemoteComponents,
  render: renderRemote,
  container: rootContainerLocator,
  prepareScreenshot,
};

const localTestEnvironement: TestEnvironement = {
  toString: () => "Local",
  components: Components,
  render: renderLocal,
  container: rootContainerLocator,
  prepareScreenshot,
};

export const testEnvironments = [
  localTestEnvironement,
  remoteTestEnvironement,
] as const;
