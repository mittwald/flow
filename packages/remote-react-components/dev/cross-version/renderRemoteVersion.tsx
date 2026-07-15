/**
 * Real helper module that holds the JSX-heavy rendering glue for the
 * cross-version test environments.
 *
 * `crossVersionEnvironmentsPlugin.ts` writes a companion generated module
 * (`dev/cross-version/.generated/environments.ts`) with one `testEnvironments`
 * entry per resolved old version. That generated module imports
 * `makeRenderRemote` from here rather than inlining this JSX itself, because
 * JSX needs a real `.tsx`/`.jsx` file path for `@vitejs/plugin-react`'s
 * transform to apply — see that plugin file's top comment for the full
 * rationale (including a separate, more consequential dependency-scanner
 * limitation this split does NOT avoid).
 */
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";
import { NotificationProvider } from "@mittwald/flow-react-components";
import { cleanup, render } from "vitest-browser-react";
import type { ScreenshotMatcherOptions } from "vitest/browser";
import {
  useMemo,
  type ComponentType,
  type FC,
  type PropsWithChildren,
} from "react";
import { RootContainer, rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect } from "vitest";

export { rootContainerLocator };

export const setNeutralPointerPosition = async (): Promise<void> => {
  await rootContainerLocator.unhover();
  rootContainerLocator.element().focus();
};

export const testScreenshot = async (
  description: string,
  options: ScreenshotMatcherOptions = {},
): Promise<void> => {
  await setNeutralPointerPosition();
  await expect(rootContainerLocator).toMatchScreenshot(description, options);
};

/** Minimal shape shared by every resolved version's `RemoteRoot` export. */
export type VersionedRemoteRootComponent = ComponentType<
  PropsWithChildren<{ __remoteReceiver?: RemoteReceiver }>
>;

/**
 * Builds a `render` function bound to one OLD version's `RemoteRoot`, wired to
 * the CURRENT host `RemoteRenderer`/`RemoteReceiver` — the same composition as
 * `renderRemote` in `src/tests/lib/environments.tsx`.
 */
export function makeRenderRemote(
  RemoteRoot: VersionedRemoteRootComponent,
): typeof render {
  const RemoteTestUi: FC<PropsWithChildren> = (props) => {
    const receiver = useMemo(() => new RemoteReceiver(), []);

    return (
      <RootContainer>
        <RemoteRenderer __remoteReceiver={receiver} />
        <RemoteRoot __remoteReceiver={receiver}>
          <NotificationProvider>{props.children}</NotificationProvider>
        </RemoteRoot>
      </RootContainer>
    );
  };

  return (async (ui, options) => {
    await cleanup();
    const result = await render(<RemoteTestUi>{ui}</RemoteTestUi>, options);
    await setNeutralPointerPosition();
    return result;
  }) as typeof render;
}
