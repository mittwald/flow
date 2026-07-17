// OLD imports first so the old flow-remote-elements register their flr-* tags
// before the current host renderer's copy (first-wins define patch in setup.ts
// skips the current duplicate) => the OLD element definitions win.
import * as remoteComponents from "@mittwald/flow-remote-react-components";
import OldRemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { RootContainer, rootContainerLocator } from "@/tests/lib/RootContainer";
// Structure-only comparison: structuralHtml strips ALL attributes, so only the
// element tree (tags + nesting + text) is compared. This is the in-process
// layer's guarantee — broad, low-noise backwards-compat of the DOM SHAPE the
// current host builds from old remote output. Attribute-level fidelity is the
// iframe harness's job (see e2e/cross-version).
import { structuralHtml } from "./structuralHtml";
import { cleanup, render } from "vitest-browser-react";
import { useMemo, type FC, type PropsWithChildren } from "react";
import { expect } from "vitest";
import { isTestComparable } from "./testVersionSupport";

declare const __CROSS_VERSION_REF_DIR__: string;
declare const __FLOW_CROSS_VERSION__: string;

const slug = (value: string): string =>
  value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const refPathFor = (testName: string, description: string): string =>
  `${__CROSS_VERSION_REF_DIR__}/${slug(`${testName}-${description}`)}.html`;

// One tag per line so a structural-mismatch diff is line-oriented and readable.
const prettyTags = (html: string): string => html.replace(/></g, ">\n<");

const CrossVersionUi: FC<PropsWithChildren> = ({ children }) => {
  const receiver = useMemo(() => new RemoteReceiver(), []);
  return (
    <RootContainer>
      <RemoteRenderer __remoteReceiver={receiver} />
      <OldRemoteRoot __remoteReceiver={receiver}>{children}</OldRemoteRoot>
    </RootContainer>
  );
};

const renderCrossVersion: typeof render = async (ui, options) => {
  await cleanup();
  const result = await render(<CrossVersionUi>{ui}</CrossVersionUi>, options);
  await setNeutralPointerPosition();
  return result;
};

const setNeutralPointerPosition = async () => {
  await rootContainerLocator.unhover();
  rootContainerLocator.element().focus();
};

// The current pass writes ephemeral HTML refs; old-version passes compare.
const testScreenshot = async (description: string): Promise<void> => {
  await setNeutralPointerPosition();
  const testName = expect.getState().currentTestName ?? description;

  if (
    __FLOW_CROSS_VERSION__ !== "current" &&
    !isTestComparable(testName, __FLOW_CROSS_VERSION__)
  ) {
    console.warn(
      `[cross-version-inprocess] SKIP ${testName}: not comparable with ${__FLOW_CROSS_VERSION__}`,
    );
    return;
  }

  // Compare element tree only (all attributes stripped); the current pass writes
  // the ephemeral ref, old-version passes compare against it.
  const html = prettyTags(
    structuralHtml(rootContainerLocator.element().innerHTML),
  );
  await expect(html).toMatchFileSnapshot(refPathFor(testName, description));
};

export const crossVersionEnvironment = {
  toString: () => "CrossVersion",
  components: remoteComponents,
  render: renderCrossVersion,
  container: rootContainerLocator,
  testScreenshot,
};
