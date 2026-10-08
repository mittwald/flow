import RemoteRoot from "@/components/RemoteRoot";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  type Mock,
} from "vitest";
import {
  createApp,
  defineComponent,
  h,
  onMounted,
  ref,
  watchEffect,
  type App,
  type AppConfig,
  type Component,
} from "vue";

/* A host connection the test controls: only `setError` is looked at. */
const host = vi.hoisted(() => ({
  setError: vi.fn(async (error: string) => void error),
  ignore: async () => undefined,
}));

vi.mock("@mittwald/ext-bridge/browser", () => ({ initExtBridge: vi.fn() }));

vi.mock("@mittwald/flow-remote-core", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  connectHostRenderRootRef: () => () =>
    Promise.resolve({
      imports: {
        setError: host.setError,
        setIsLoading: host.ignore,
        setNavigationState: host.ignore,
        getHostConfig: async () => ({}),
        reportDeprecation: host.ignore,
        reportEvent: host.ignore,
      },
    }),
}));

let app: App | undefined;
let errorHandler: Mock<NonNullable<AppConfig["errorHandler"]>>;

/* Mounts the component under a connected `RemoteRoot`, as an extension does. */
const mountInRoot = async (component: Component) => {
  const container = document.createElement("div");
  document.body.append(container);
  const isRendered = vi.fn();

  app = createApp({
    render: () =>
      h(RemoteRoot, null, {
        default: () => [h(component), h({ setup: () => isRendered })],
      }),
  });
  app.config.errorHandler = errorHandler;
  app.mount(container);
  app.onUnmount(() => container.remove());

  /* The children render once the host connection is up. */
  await vi.waitFor(() => expect(isRendered).toHaveBeenCalled());
};

beforeEach(() => {
  host.setError.mockClear();
  errorHandler = vi.fn();
});

afterEach(() => {
  app?.unmount();
  app = undefined;
});

describe("An error in a remote Vue app", () => {
  test("in a render is the host's failure, and reaches the app", async () => {
    await mountInRoot(
      defineComponent(() => () => {
        throw new Error("Broken render");
      }),
    );

    await vi.waitFor(() =>
      expect(host.setError).toHaveBeenCalledWith(
        expect.stringContaining("Broken render"),
      ),
    );
    expect(errorHandler).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Broken render" }),
      expect.anything(),
      "render function",
    );
  });

  test("in setup is the host's failure", async () => {
    await mountInRoot(
      defineComponent(() => {
        throw new Error("Broken setup");
      }),
    );

    await vi.waitFor(() =>
      expect(host.setError).toHaveBeenCalledWith(
        expect.stringContaining("Broken setup"),
      ),
    );
  });

  /* React's error boundary does not catch these either. */
  test.each([
    [
      "an async mounted hook",
      () =>
        defineComponent(() => {
          onMounted(async () => {
            throw new Error("Late failure");
          });
          return () => null;
        }),
    ],
    [
      "a watchEffect",
      () =>
        defineComponent(() => {
          const isBroken = ref(false);
          watchEffect(() => {
            if (isBroken.value) {
              throw new Error("Late failure");
            }
          });
          onMounted(() => (isBroken.value = true));
          return () => null;
        }),
    ],
  ])("in %s is left to the app", async (_name, component) => {
    await mountInRoot(component());

    await vi.waitFor(() =>
      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Late failure" }),
        expect.anything(),
        expect.any(String),
      ),
    );
    expect(host.setError).not.toHaveBeenCalled();
  });
});
