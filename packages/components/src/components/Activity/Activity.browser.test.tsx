import { beforeEach, expect } from "vitest";
import { render } from "vitest-browser-react";
import { Activity } from "@/components/Activity/index";
import { page } from "vitest/browser";
import { createPortal } from "react-dom";
import { useIsActivityActive } from "@/components/Activity/context";

const TestComponent = () => {
  return <span role="status">Active</span>;
};

const testComponent = () =>
  page.getByRole("status", {
    includeHidden: false,
  });

beforeEach(() => {
  vi.useFakeTimers({
    shouldAdvanceTime: false,
  });
});
afterEach(() => {
  vi.restoreAllMocks();
});

test("Does render children without any Activity", async () => {
  await render(<TestComponent />);
  expect(testComponent()).toBeInTheDocument();
});

test("Does render children when wrapped in active Activity", async () => {
  await render(
    <Activity isActive={true} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).toBeInTheDocument();
});

test("Does NOT render children when wrapped in inactive Activity", async () => {
  await render(
    <Activity isActive={false} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).not.toBeInTheDocument();
});

test("Does NOT render children when wrapped in delayed inactive Activity", async () => {
  await render(
    <Activity isActive={false} inactiveDelay={1000} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).not.toBeInTheDocument();
});

test("Does NOT render children when switching from active to inactive", async () => {
  // initial render as active
  const { rerender } = await render(
    <Activity isActive={true} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).toBeInTheDocument();

  // re-render as inactive
  await rerender(
    <Activity isActive={false} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).not.toBeInTheDocument();
});

test("Does NOT render children after delay when wrapped in delayed inactive Activity", async () => {
  const delay = 5000;

  // initial render as active
  const { rerender } = await render(
    <Activity isActive={true} inactiveDelay={delay} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).toBeInTheDocument();

  // re-render as inactive
  await rerender(
    <Activity isActive={false} inactiveDelay={delay} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).toBeInTheDocument();

  await vitest.advanceTimersByTimeAsync(delay);
  // re-render after elapsed timer
  await rerender(
    <Activity isActive={false} inactiveDelay={delay} forceCustomActivity>
      <TestComponent />
    </Activity>,
  );
  expect(testComponent()).not.toBeInTheDocument();
});

const PortalledProbe = () => {
  const isActive = useIsActivityActive();

  return createPortal(
    <span data-testid="portalled">{isActive ? "active" : "inactive"}</span>,
    document.body,
  );
};

const portalledText = () =>
  document.querySelector('[data-testid="portalled"]')?.textContent;

/*
 * A hidden subtree renders but never commits, and React hides only its inline
 * DOM — so whatever it portalled elsewhere would stay on screen frozen. The
 * subtree gets one commit to unmount that content before it is hidden.
 */
test.each([[true], [false]])(
  "Children learn about deactivation before they are hidden (forceCustomActivity=%s)",
  async (forceCustomActivity: boolean) => {
    const { rerender } = await render(
      <Activity isActive forceCustomActivity={forceCustomActivity}>
        <PortalledProbe />
      </Activity>,
    );
    expect(portalledText()).toBe("active");

    await rerender(
      <Activity isActive={false} forceCustomActivity={forceCustomActivity}>
        <PortalledProbe />
      </Activity>,
    );
    expect(portalledText()).toBe("inactive");

    await rerender(
      <Activity isActive forceCustomActivity={forceCustomActivity}>
        <PortalledProbe />
      </Activity>,
    );
    expect(portalledText()).toBe("active");
  },
);

test("A nested Activity stays inactive while its parent is inactive", async () => {
  const { rerender } = await render(
    <Activity isActive forceCustomActivity>
      <Activity isActive forceCustomActivity>
        <PortalledProbe />
      </Activity>
    </Activity>,
  );
  expect(portalledText()).toBe("active");

  await rerender(
    <Activity isActive={false} forceCustomActivity>
      <Activity isActive forceCustomActivity>
        <PortalledProbe />
      </Activity>
    </Activity>,
  );
  expect(portalledText()).toBe("inactive");
});
