import { expect, test } from "vitest";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import { type AnyThread, TRANSFERABLE } from "@quilted/threads";
import { addAwaitedArrayBuffer } from "@mittwald/flow-core";
import { CalendarDate } from "@internationalized/date";
import { createFileList } from "@/tests/utils";

test("will create a new arraybuffer when detached", async () => {
  let testFile = new File([new ArrayBuffer(0)], "test");
  testFile = await addAwaitedArrayBuffer(testFile);

  const buff = await testFile.arrayBuffer();
  expect(buff.detached).toBeFalsy();

  // make the file buffer detached
  structuredClone(buff, { transfer: [buff] });

  expect(buff.detached).toBeTruthy();
  testFile = await addAwaitedArrayBuffer(testFile);

  const newBuff = await testFile.arrayBuffer();
  expect(newBuff.detached).toBeFalsy();
});

test("will omit specific types on serialize", async () => {
  const serializer = new FlowThreadSerialization();
  const result = serializer.serialize(
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
    await addAwaitedArrayBuffer(new File([buff1], "foo", { lastModified: 1 })),
    await addAwaitedArrayBuffer(new File([buff2], "bar", { lastModified: 2 })),
  ]);

  const formData = new FormData();
  formData.set("foo", "string");
  formData.set(
    "file",
    await addAwaitedArrayBuffer(
      new File([buff3], "formDataFile1", { lastModified: 3 }),
    ),
  );
  formData.append(
    "file",
    await addAwaitedArrayBuffer(
      new File([buff4], "formDataFile2", { lastModified: 4 }),
    ),
  );

  const testMap = new Map();
  testMap.set(
    "foo",
    await addAwaitedArrayBuffer(
      new File([buff5], "mapFile1", { lastModified: 1 }),
    ),
  );

  const calendarDate = new CalendarDate(2025, 1, 2);

  const dataTransfer = new DataTransfer();
  dataTransfer.setData("text/plain", "test");
  Object.setPrototypeOf(dataTransfer, DataTransfer.prototype);

  const transferable: ArrayBuffer[] = [];
  const serializeResult = serializer.serialize(
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

  expect(transferable).toHaveLength(5);
  expect(transferable).toEqual(
    expect.arrayContaining([expect.any(ArrayBuffer)]),
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

  const deserializeResult = serializer.deserialize(
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
