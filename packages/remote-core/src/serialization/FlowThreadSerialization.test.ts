import { afterEach, describe, expect, test, vi } from "vitest";
import { ThreadMessagePort } from "@quilted/threads";
import { CalendarDate } from "@internationalized/date";
import { Policy } from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";

/*
 * Every value a remote component hands the host crosses `postMessage`, which
 * only carries structured-cloneable data. What survives that trip is the
 * contract between an extension and the host, so these tests send values across
 * a real MessageChannel instead of calling the serializers directly.
 */

interface Exports {
  receive: (value: unknown) => Promise<void>;
}

const sendThroughThread = async (value: unknown): Promise<unknown> => {
  const { port1, port2 } = new MessageChannel();
  let received: unknown;

  new ThreadMessagePort<Record<string, never>, Exports>(port1, {
    serialization: new FlowThreadSerialization(),
    exports: {
      receive: async (arrived) => {
        received = arrived;
      },
    },
  });

  const remote = new ThreadMessagePort<Exports>(port2, {
    serialization: new FlowThreadSerialization(),
  });

  port1.start();
  port2.start();

  await remote.imports.receive(value);

  port1.close();
  port2.close();

  return received;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("values structured clone handles itself", () => {
  test.each([
    ["a string", "hello"],
    ["a number", 42],
    ["null", null],
    ["a nested object", { a: { b: [1, 2, 3] } }],
    ["a Map", new Map([["key", "value"]])],
    ["a Set", new Set(["value"])],
  ])("%s arrives unchanged", async (_name, value) => {
    await expect(sendThroughThread(value)).resolves.toEqual(value);
  });
});

describe("Flow's own serializers", () => {
  test("a CalendarDate arrives as a CalendarDate, not as a string", async () => {
    const received = await sendThroughThread(new CalendarDate(2026, 2, 3));

    expect(received).toBeInstanceOf(CalendarDate);
    expect((received as CalendarDate).toString()).toBe("2026-02-03");
  });

  test("a File keeps its content and metadata", async () => {
    const received = await sendThroughThread(
      new File(["file content"], "notes.txt", {
        type: "text/plain",
        lastModified: 1_700_000_000_000,
      }),
    );

    expect(received).toBeInstanceOf(File);
    const file = received as File;
    expect(file.name).toBe("notes.txt");
    expect(file.type).toBe("text/plain");
    expect(file.lastModified).toBe(1_700_000_000_000);
    await expect(file.text()).resolves.toBe("file content");
  });

  test("a FormData keeps its text fields and its files", async () => {
    const formData = new FormData();
    formData.append("name", "Ada");
    formData.append("upload", new File(["payload"], "upload.bin"));

    const received = await sendThroughThread(formData);

    expect(received).toBeInstanceOf(FormData);
    const arrived = received as FormData;
    expect(arrived.get("name")).toBe("Ada");

    const upload = arrived.get("upload");
    expect(upload).toBeInstanceOf(File);
    expect((upload as File).name).toBe("upload.bin");
    await expect((upload as File).text()).resolves.toBe("payload");
  });

  test("a password Policy arrives as a Policy, not as its declaration", async () => {
    const received = await sendThroughThread(
      Policy.fromDeclaration({
        rules: [{ ruleType: "length", min: 8 }],
        minComplexity: 3,
      }),
    );

    expect(Policy.isPolicy(received)).toBe(true);
    expect((received as Policy).minComplexity).toBe(3);
    expect((received as Policy).rules).toHaveLength(1);
  });
});

/*
 * React tags its elements with a symbol, and `postMessage` refuses the *whole*
 * message over a single one — so one element in one prop would take down the
 * entire mutation batch and the extension would render nothing at all. Dropping
 * the value keeps the batch intact.
 */
describe("values that cannot cross the boundary", () => {
  /*
   * The shape React gives an element, built by hand: remote-core has no React
   * dependency, and it is the `$$typeof` symbol alone that `postMessage` chokes
   * on.
   */
  const reactElement = (type: unknown) => ({
    $$typeof: Symbol.for("react.transitional.element"),
    type,
    props: {},
  });

  const component = (name: string) => ({ [name]: () => null })[name];

  test("a React element is replaced with null instead of killing the message", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(
      sendThroughThread({ icon: reactElement(component("MyIcon")) }),
    ).resolves.toEqual({ icon: null });
  });

  test("the reason is reported once per component, not once per occurrence", async () => {
    const error = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const serialization = new FlowThreadSerialization();

    const rows = Array.from({ length: 5 }, () =>
      reactElement(component("Cell")),
    );
    await serialization.serialize({ rows }, undefined as never);

    expect(error).toHaveBeenCalledOnce();
    expect(error.mock.calls[0]?.[0]).toContain("<Cell />");
  });

  test("an element is named by its type, a DOM element by its tag", async () => {
    const error = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const serialization = new FlowThreadSerialization();

    await serialization.serialize(
      { a: reactElement("span"), b: reactElement({ displayName: "Memoized" }) },
      undefined as never,
    );

    expect(error.mock.calls.map((call) => call[0])).toEqual([
      expect.stringContaining("<span />"),
      expect.stringContaining("<Memoized />"),
    ]);
  });

  test("a DOM element is dropped, not sent", async () => {
    await expect(
      sendThroughThread({ anchor: document.createElement("div") }),
    ).resolves.toEqual({ anchor: null });
  });

  test("window is dropped, not sent", async () => {
    await expect(sendThroughThread({ view: window })).resolves.toEqual({
      view: null,
    });
  });
});
