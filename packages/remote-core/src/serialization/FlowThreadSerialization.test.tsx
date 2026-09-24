import { describe, expect, test, vi } from "vitest";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import {
  type AnyThread,
  markAsTransferable,
  ThreadMessagePort,
  TRANSFERABLE,
} from "@quilted/threads";
import { CalendarDate } from "@internationalized/date";
import { createFileList } from "@/tests/utils";

test("will omit specific types on serialize", async () => {
  const serializer = new FlowThreadSerialization();
  const result = await serializer.serialize(
    {
      window,
      element: document.createElement("div"),
    },
    {} as never,
  );

  expect(result).toStrictEqual({
    element: null,
    window: null,
  });
});

test("will serialize and deserialize structures", async () => {
  const serializer = new FlowThreadSerialization();

  const buff1 = new ArrayBuffer(1);
  const buff2 = new ArrayBuffer(2);
  const buff3 = new ArrayBuffer(3);
  const buff4 = new ArrayBuffer(4);
  const buff5 = new ArrayBuffer(5);

  const fileList = createFileList([
    new File([buff1], "foo", { lastModified: 1 }),
    new File([buff2], "bar", { lastModified: 2 }),
  ]);

  const formData = new FormData();
  formData.set("foo", "string");
  formData.set("file", new File([buff3], "formDataFile1", { lastModified: 3 }));
  formData.append(
    "file",
    new File([buff4], "formDataFile2", { lastModified: 4 }),
  );

  const testMap = new Map();
  testMap.set("foo", new File([buff5], "mapFile1", { lastModified: 1 }));

  const calendarDate = new CalendarDate(2025, 1, 2);

  const dataTransfer = new DataTransfer();
  dataTransfer.setData("text/plain", "test");
  Object.setPrototypeOf(dataTransfer, DataTransfer.prototype);

  const transferable: ArrayBuffer[] = [];
  const serializeResult = await serializer.serialize(
    {
      dataTransfer: dataTransfer,
      date: calendarDate,
      testMap: testMap,
      foo: fileList,
      bar: 1,
      baz: [1, 2],
      event: new Event("asd"),
      form: formData,
    },
    {} as AnyThread,
    transferable,
  );

  expect(transferable).toEqual(
    expect.arrayContaining([
      markAsTransferable(buff1),
      markAsTransferable(buff2),
      markAsTransferable(buff3),
      markAsTransferable(buff4),
      markAsTransferable(buff5),
    ]),
  );

  // we can't check with toBe since the internal file arrayBuffer function will prevent this
  // since symbols are not visible for copy operations we check this instead
  expect(serializeResult.foo.value).toHaveLength(2);
  expect(serializeResult.foo.value[0].content[TRANSFERABLE]).toBeTruthy();
  expect(serializeResult.foo.value[1].content[TRANSFERABLE]).toBeTruthy();

  expect(serializeResult).toStrictEqual({
    dataTransfer: {
      "mittwald.flow-remote-core.serializer.name": "DataTransferText",
      value: "test",
    },
    bar: 1,
    baz: [1, 2],
    date: {
      "mittwald.flow-remote-core.serializer.name": "CalendarDate",
      value: "2025-01-02",
    },
    event: {
      AT_TARGET: 2,
      BUBBLING_PHASE: 3,
      CAPTURING_PHASE: 1,
      NONE: 0,
    },
    foo: {
      "mittwald.flow-remote-core.serializer.name": "FileList",
      value: [
        {
          content: buff1,
          lastModified: 1,
          name: "foo",
          type: "",
        },
        {
          content: buff2,
          lastModified: 2,
          name: "bar",
          type: "",
        },
      ],
    },
    form: {
      "mittwald.flow-remote-core.serializer.name": "FormData",
      value: [
        ["foo", "string"],
        [
          "file",
          {
            content: buff3,
            lastModified: 3,
            name: "formDataFile1",
            type: "",
          },
        ],
        [
          "file",
          {
            content: buff4,
            lastModified: 4,
            name: "formDataFile2",
            type: "",
          },
        ],
      ],
    },
    testMap: new Map([
      [
        "foo",
        {
          "mittwald.flow-remote-core.serializer.name": "File",
          value: {
            content: buff5,
            lastModified: 1,
            name: "mapFile1",
            type: "",
          },
        },
      ],
    ]),
  });

  const deserializeResult = await serializer.deserialize(
    serializeResult,
    {} as AnyThread,
  );

  expect(deserializeResult).toBeTypeOf("object");

  expect(deserializeResult.dataTransfer).toBeInstanceOf(DataTransfer);
  expect(deserializeResult.dataTransfer.getData("text")).toBe("test");
  delete deserializeResult.dataTransfer;

  expect(deserializeResult.form).toBeInstanceOf(FormData);
  expect(Array.from(deserializeResult.form.entries())).toStrictEqual([
    ["foo", "string"],
    ["file", new File([buff3], "formDataFile1", { lastModified: 3 })],
    ["file", new File([buff4], "formDataFile2", { lastModified: 4 })],
  ]);
  delete deserializeResult.form;

  expect(deserializeResult).toStrictEqual({
    bar: 1,
    baz: [1, 2],
    date: calendarDate,
    event: {
      AT_TARGET: 2,
      BUBBLING_PHASE: 3,
      CAPTURING_PHASE: 1,
      NONE: 0,
    },
    foo: [
      new File([buff1], "foo", { lastModified: 1 }),
      new File([buff2], "bar", { lastModified: 2 }),
    ],
    testMap: new Map([
      ["foo", new File([buff5], "mapFile1", { lastModified: 1 })],
    ]),
  });
});

/*
 * Serialization is async in this build (Flow's serializers await File reads),
 * and the cycle guard parks `undefined` in the `seen` map until the value's own
 * frame finishes. Both only hold together while the traversal visits one value
 * at a time — see the comment on `seen.set(value, undefined)` in
 * patches/@quilted__threads@3.3.1.patch. These cases are the ones that regress
 * the moment a container serializes its members concurrently again: a repeated
 * reference reads the placeholder mid-flight and silently becomes `undefined`.
 */
test("will serialize a repeated reference in every position", async () => {
  const serializer = new FlowThreadSerialization();
  const row = { time: "0:00", value: 40 };

  const result = await serializer.serialize(
    {
      // one array prop repeating the same object — two charts sharing `data`
      data: [row, row],
      // the repeat one level deeper, reached through sibling array items
      nested: [{ row }, { row }],
      // two props of one object, which were never affected
      first: row,
      second: row,
      map: new Map([
        ["a", row],
        ["b", row],
      ]),
      // a Set cannot hold one reference twice, so share through its members
      set: new Set([{ row }, { row }]),
    },
    {} as AnyThread,
  );

  expect(result).toStrictEqual({
    data: [row, row],
    nested: [{ row }, { row }],
    first: row,
    second: row,
    map: new Map([
      ["a", row],
      ["b", row],
    ]),
    set: new Set([{ row }, { row }]),
  });
});

test("will keep circular references from recursing", async () => {
  const serializer = new FlowThreadSerialization();

  const selfReferencing: Record<string, unknown> = { name: "self" };
  selfReferencing.self = selfReferencing;

  const a: Record<string, unknown> = { name: "a" };
  const b: Record<string, unknown> = { name: "b", a };
  a.b = b;

  const result = await serializer.serialize(
    {
      selfReferencing,
      // a mutual cycle reached twice through one array: the pair is what makes
      // "await the pending result instead of the placeholder" deadlock
      mutual: [a, b, a],
    },
    {} as AnyThread,
  );

  expect(result).toStrictEqual({
    selfReferencing: { name: "self", self: undefined },
    mutual: [
      { name: "a", b: { name: "b", a: undefined } },
      { name: "b", a: undefined },
      { name: "a", b: { name: "b", a: undefined } },
    ],
  });
});

/*
 * A React element carries `$$typeof: Symbol(react.…)`. Symbols pass through
 * serialization untouched and `postMessage` refuses them — refusing the whole
 * message, so one element in one prop drops the entire mutation batch and the
 * extension renders nothing (observed on a remote `List` in table view). Rendered
 * output has to be a slot; where it is a property anyway, dropping just that
 * value keeps the rest of the batch alive.
 */
test("will not let React values break the whole payload", async () => {
  const serializer = new FlowThreadSerialization();
  const consoleError = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);

  const Icon = function Icon() {
    return null;
  };
  const element = {
    $$typeof: Symbol.for("react.transitional.element"),
    type: Icon,
    key: null,
    ref: null,
    props: { color: "success" },
  };

  const result = await serializer.serialize(
    {
      label: "kept",
      icon: element,
      nested: [element, { deeper: element }],
    },
    {} as AnyThread,
  );

  expect(result).toStrictEqual({
    label: "kept",
    icon: null,
    nested: [null, { deeper: null }],
  });

  // the payload has to survive the structured clone that postMessage applies
  expect(() => structuredClone(result)).not.toThrow();

  // named once per component, not once per occurrence
  expect(consoleError).toHaveBeenCalledTimes(1);
  expect(consoleError.mock.calls[0]?.[0]).toContain("<Icon />");

  consoleError.mockRestore();
});

/*
 * A real round trip: two `FlowThreadSerialization` instances on the two ends of
 * a `MessageChannel`, so the value is serialized, handed to `postMessage`,
 * structurally cloned and deserialized — the same path a remote prop takes.
 *
 * Calling `serialize` alone would not catch these: a value the custom hook
 * declines is returned as-is, so the difference between "structured clone
 * carries it" and "structured clone refuses it" only shows at the port.
 */
interface EchoExports {
  echo: (value: unknown) => Promise<void>;
}

const sendThroughThread = async (value: unknown): Promise<unknown> => {
  const { port1, port2 } = new MessageChannel();

  let received: unknown;
  let resolveReceived!: () => void;
  const receivedOnce = new Promise<void>((resolve) => {
    resolveReceived = resolve;
  });

  new ThreadMessagePort<Record<string, never>, EchoExports>(port1, {
    serialization: new FlowThreadSerialization(),
    exports: {
      echo: async (payload) => {
        received = payload;
        resolveReceived();
      },
    },
  });

  const remote = new ThreadMessagePort<EchoExports>(port2, {
    serialization: new FlowThreadSerialization(),
  });

  port1.start();
  port2.start();

  try {
    await remote.imports.echo(value);
    await receivedOnce;
    return received;
  } finally {
    port1.close();
    port2.close();
  }
};

/*
 * Built-ins whose state lives in internal slots, not in own enumerable
 * properties. Anything `isSerializableByBase` does not claim reaches the
 * `serialize({ ...val })` fallback, which keeps only those properties — so a
 * `Date` crossed as `{}`, a `RegExp` and an `Error` the same, and a
 * `Uint8Array` as `{"0":1,"1":2,"2":3}`. No error, no warning.
 *
 * Structured clone carries all of them, so the fix is to let the base
 * serializer through rather than to add a named serializer — which an older
 * peer would not understand (the protocol is versioned).
 *
 * `Blob` is in `isSerializableByBase` for the same reason but is not asserted
 * here: happy-dom's `structuredClone` does not implement it and degrades it to
 * a plain object either way, so the case would assert the environment, not the
 * code. `File` stays with `fileSerializer` — the big round trip above is what
 * guards that the `Blob` branch does not swallow it.
 */
describe("values structured clone handles itself", () => {
  test("a Date", async () => {
    const date = new Date("2026-02-03T04:05:06.000Z");

    const received = await sendThroughThread(date);

    expect(received).toBeInstanceOf(Date);
    expect(received).toStrictEqual(date);
    // not the same object — it really crossed the port
    expect(received).not.toBe(date);
  });

  test("a Date nested in an object and an array", async () => {
    const date = new Date("2026-02-03T04:05:06.000Z");

    const received = (await sendThroughThread({
      when: date,
      history: [date],
    })) as { when: Date; history: Date[] };

    expect(received.when).toBeInstanceOf(Date);
    expect(received.when.toISOString()).toBe("2026-02-03T04:05:06.000Z");
    expect(received.history[0]).toBeInstanceOf(Date);
    expect(received.history[0]?.toISOString()).toBe("2026-02-03T04:05:06.000Z");
  });

  test("a RegExp", async () => {
    const received = await sendThroughThread(/ab+c/gi);

    expect(received).toBeInstanceOf(RegExp);
    expect((received as RegExp).source).toBe("ab+c");
    expect((received as RegExp).flags).toBe("gi");
  });

  test("an Error", async () => {
    const received = await sendThroughThread(new TypeError("kaputt"));

    expect(received).toBeInstanceOf(Error);
    expect((received as Error).name).toBe("TypeError");
    expect((received as Error).message).toBe("kaputt");
  });

  test("an ArrayBuffer", async () => {
    const received = await sendThroughThread(new Uint8Array([4, 5]).buffer);

    expect(received).toBeInstanceOf(ArrayBuffer);
    expect([...new Uint8Array(received as ArrayBuffer)]).toStrictEqual([4, 5]);
  });

  test("a TypedArray", async () => {
    const received = await sendThroughThread(new Uint8Array([1, 2, 3]));

    expect(received).toBeInstanceOf(Uint8Array);
    expect([...(received as Uint8Array)]).toStrictEqual([1, 2, 3]);
  });

  test("a DataView", async () => {
    const received = await sendThroughThread(
      new DataView(new Uint8Array([9, 8]).buffer),
    );

    expect(received).toBeInstanceOf(DataView);
    expect((received as DataView).getUint8(0)).toBe(9);
  });
});

/*
 * The counterpart to the list above, and the reason it is a list and not
 * "everything that is not a basic object": a `URL` is not structured-cloneable.
 * Adding it to `isSerializableByBase` would turn a silently emptied object into
 * a `DataCloneError` — and the send takes the whole mutation batch with it, so
 * the cure is worse than the disease. A named serializer would break older
 * peers. It stays flattened on purpose; if a prop ever needs one, send the
 * string.
 *
 * Asserting the flattened result is what makes this a guard rather than a note:
 * claim `URL` in `isSerializableByBase` and this send throws instead.
 */
test("a URL stays flattened, because structured clone refuses it", async () => {
  const received = await sendThroughThread({
    href: new URL("https://example.com/a?b=c"),
  });

  expect(received).toStrictEqual({ href: {} });

  // the reason it cannot simply join the list above
  expect(() => structuredClone(new URL("https://example.com"))).toThrow();
});
