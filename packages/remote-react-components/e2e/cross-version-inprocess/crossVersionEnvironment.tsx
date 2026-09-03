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

declare const __CROSS_VERSION_REF_DIR__: string;

const slugify = (value: string): string =>
  value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

// The reference file is keyed by the SOURCE FILE too, not just the test name +
// description. Two reused tests in different files can share a name — e.g. both
// Checkbox and CheckboxButton have a `Checkbox edge cases` test — which without
// the file scope would collide on one ref file, so whichever wrote it last made
// the other version-compare mismatch (a spurious, order-dependent failure).
// This mirrors how vitest itself scopes browser screenshots per test file.
const referencePathFor = (
  testFile: string,
  testName: string,
  description: string,
): string =>
  `${__CROSS_VERSION_REF_DIR__}/${slugify(`${testFile}-${testName}-${description}`)}.html`;

/** Basename of a test file path, without extension, for use in a ref filename. */
const testFileKey = (testPath: string | undefined): string => {
  if (!testPath) {
    return "unknown";
  }
  const base = testPath.split(/[/\\]/).pop() ?? testPath;
  return base.replace(/\.(browser\.)?test\.[jt]sx?$/, "");
};

// One tag per line so a structural-mismatch diff is line-oriented and readable.
const formatTagsForDiff = (html: string): string => html.replace(/></g, ">\n<");

const captureStructure = (): string =>
  formatTagsForDiff(structuralHtml(rootContainerLocator.element().innerHTML));

/**
 * Read the structural HTML once it has stopped changing, so an in-flight render
 * can't be captured mid-frame and produce a spurious diff. It waits for a
 * SUSTAINED quiet window (`stableReads` consecutive identical samples), not
 * just one matching pair: ResizeObserver-driven text truncation briefly
 * duplicates the DOM (a measuring copy alongside the displayed one) and can
 * plateau for a frame or two before collapsing, so a single matching pair can
 * capture that transient. Polls up to `maxSamples` before giving up and
 * returning the last sample (best effort).
 */
const readStableStructure = async (
  stableReads = 5,
  intervalMs = 50,
  maxSamples = 80,
): Promise<string> => {
  let previous = captureStructure();
  let consecutive = 1;
  for (let i = 0; i < maxSamples; i++) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    const next = captureStructure();
    if (next === previous) {
      consecutive += 1;
      if (consecutive >= stableReads) {
        return next;
      }
    } else {
      consecutive = 1;
      previous = next;
    }
  }
  return previous;
};

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
// Tests whose output doesn't hold on a given old version are skipped whole
// (test.skipIf(crossVersion({ below: ... })) in the reused test), so anything that
// reaches here is expected to match.
const testScreenshot = async (description: string): Promise<void> => {
  await setNeutralPointerPosition();
  const state = expect.getState();
  const testName = state.currentTestName ?? description;
  const testFile = testFileKey(state.testPath);

  // Compare element tree only (all attributes stripped); the current pass writes
  // the ephemeral ref, old-version passes compare against it. Wait for the
  // structure to settle first so async rendering can't cause a spurious diff.
  const html = await readStableStructure();
  await expect(html).toMatchFileSnapshot(
    referencePathFor(testFile, testName, description),
  );
};

export const crossVersionEnvironment = {
  toString: () => "CrossVersion",
  components: remoteComponents,
  render: renderCrossVersion,
  container: rootContainerLocator,
  testScreenshot,
};
