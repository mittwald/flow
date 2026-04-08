import type { SettingsBackend } from "./backends/types";
import type { SettingsJson } from "./models/SettingsStore";
import SettingsProvider, { useSettings } from "./SettingsProvider";
import { Render } from "@/lib/react/components/Render";
import type {
  GetSettingsMiddleware,
  SetSettingsMiddleware,
} from "./middleware/types";
import { render } from "vitest-browser-react";
import type { ComponentSettingsJson } from "./models/ComponentSettings";
import z from "zod";
import { userEvent } from "vitest/browser";

class InMemorySettingsBackend implements SettingsBackend {
  public data: SettingsJson = {};

  public constructor(initialData?: ComponentSettingsJson) {
    if (initialData !== undefined) {
      this.data = {
        List: {
          test: JSON.stringify(initialData),
        },
      };
    }
  }

  public async load(): Promise<SettingsJson> {
    return this.data;
  }

  public async store(data: SettingsJson): Promise<void> {
    this.data = data;
  }
}

let testIndex = 0;

beforeEach(() => {
  testIndex++;
});

const testSettings1 = Object.freeze({ foo: "foo", bar: "bar" });
const testSettings2 = Object.freeze({ baz: "baz", bam: "bam" });

test.each<{
  middleware?: {
    get?: GetSettingsMiddleware;
    set?: SetSettingsMiddleware;
  };
  initialSettings?: {
    outerStore?: ComponentSettingsJson;
    innerStore?: ComponentSettingsJson;
  };
  expectedSettings?: {
    outerStore?: ComponentSettingsJson;
    innerStore?: ComponentSettingsJson;
    component?: ComponentSettingsJson;
  };
  updateSettingsTo?: ComponentSettingsJson;
}>([
  {
    initialSettings: {
      outerStore: testSettings1,
    },
    expectedSettings: {
      component: testSettings1,
    },
  },
  {
    initialSettings: {
      innerStore: testSettings1,
    },
    expectedSettings: {
      component: testSettings1,
    },
  },
  {
    initialSettings: {
      outerStore: testSettings2,
      innerStore: testSettings1,
    },
    expectedSettings: {
      component: testSettings1,
    },
  },
  {
    initialSettings: {
      outerStore: testSettings2,
      innerStore: testSettings1,
    },
    middleware: {
      get: (_, __, ___, getParent) => getParent(),
    },
    expectedSettings: {
      component: testSettings2,
    },
  },
  {
    initialSettings: {
      outerStore: testSettings2,
      innerStore: testSettings1,
    },
    middleware: {
      get: (component, key, settings, getParent) => {
        expect(component).toBe("List");
        expect(key).toBe("test");
        expect(settings).toEqual(testSettings1);
        expect(getParent()).toEqual(testSettings2);
        return settings;
      },
    },
  },
  {
    updateSettingsTo: testSettings1,
    expectedSettings: {
      innerStore: testSettings1,
      outerStore: undefined,
    },
  },
  {
    updateSettingsTo: testSettings1,
    middleware: {
      set: (_, __, settings, setParent) => {
        setParent(settings);
      },
    },
    expectedSettings: {
      innerStore: undefined,
      outerStore: testSettings1,
    },
  },
  {
    updateSettingsTo: testSettings1,
    middleware: {
      set: (_, __, ___, setParent) => {
        setParent(testSettings1);
        return testSettings2;
      },
    },
    expectedSettings: {
      innerStore: testSettings2,
      outerStore: testSettings1,
    },
  },
  {
    updateSettingsTo: testSettings1,
    middleware: {
      set: (component, key, settings) => {
        expect(component).toBe("List");
        expect(key).toBe("test");
        expect(settings).toEqual(testSettings1);
      },
    },
  },
])("Run test %#", async (testData) => {
  const { middleware, expectedSettings, initialSettings, updateSettingsTo } =
    testData;

  const outerBackend = new InMemorySettingsBackend(initialSettings?.outerStore);
  const innerBackend = new InMemorySettingsBackend(initialSettings?.innerStore);

  const ui = await render(
    <SettingsProvider
      type="custom"
      store={outerBackend}
      id={`outer-${testIndex}`}
    >
      <SettingsProvider
        type="custom"
        store={innerBackend}
        id={`inner-${testIndex}`}
        middleware={middleware}
      >
        <Render>
          {() => {
            const settings = useSettings();
            const settingsJson = settings?.get("List", "test", z.any());

            const updateSettings = () => {
              if (updateSettingsTo) {
                settings?.set("List", "test", z.any(), updateSettingsTo);
              }
            };

            return (
              <>
                <div data-testid="settings">{JSON.stringify(settingsJson)}</div>
                <button data-testid="store" onClick={updateSettings}>
                  Store
                </button>
              </>
            );
          }}
        </Render>
      </SettingsProvider>
    </SettingsProvider>,
  );

  await userEvent.click(ui.getByTestId("store"));

  if (expectedSettings && "outerStore" in expectedSettings) {
    if (expectedSettings.outerStore === undefined) {
      expect(outerBackend.data).toEqual({});
      return;
    } else {
      expect(outerBackend.data).toEqual({
        List: { test: JSON.stringify(expectedSettings.outerStore) },
      });
    }
  }

  if (expectedSettings && "innerStore" in expectedSettings) {
    if (expectedSettings.innerStore === undefined) {
      expect(innerBackend.data).toEqual({});
      return;
    } else {
      expect(innerBackend.data).toEqual({
        List: { test: JSON.stringify(expectedSettings.innerStore) },
      });
    }
  }

  if (expectedSettings && "component" in expectedSettings) {
    expect(ui.getByTestId("settings")).toHaveTextContent(
      JSON.stringify(expectedSettings.component),
    );
  }
});

test("Settings are updated on rerender", async () => {
  const backend = new InMemorySettingsBackend(testSettings1);

  const testReact = (
    <SettingsProvider type="custom" store={backend} id={`test-${testIndex}`}>
      <Render>
        {() => {
          const settings = useSettings();
          const settingsJson = settings?.get("List", "test", z.any());

          const updateSettings = () => {
            settings?.set("List", "test", z.any(), testSettings2);
          };

          return (
            <>
              <div data-testid="settings">{JSON.stringify(settingsJson)}</div>
              <button data-testid="store" onClick={updateSettings}>
                Store
              </button>
            </>
          );
        }}
      </Render>
    </SettingsProvider>
  );

  const ui = await render(testReact);
  expect(ui.getByTestId("settings")).toHaveTextContent(
    JSON.stringify(testSettings1),
  );

  await userEvent.click(ui.getByTestId("store"));

  await ui.rerender(<></>);
  await ui.rerender(testReact);
  expect(ui.getByTestId("settings")).toHaveTextContent(
    JSON.stringify(testSettings2),
  );
});
