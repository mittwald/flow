import { expect, test } from "vitest";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import { TRANSFERABLE } from "@quilted/threads";
import { addAwaitedArrayBuffer } from "@mittwald/flow-core";

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

test("will serialize structures", async () => {
  const serializer = new FlowThreadSerialization();

  const buff1 = new ArrayBuffer(13);
  const buff2 = new ArrayBuffer(37);

  const list = new DataTransfer();
  list.items.add(
    await addAwaitedArrayBuffer(new File([buff1], "foo", { lastModified: 1 })),
  );
  list.items.add(
    await addAwaitedArrayBuffer(new File([buff2], "bar", { lastModified: 2 })),
  );

  const fakeFileList = list.files;
  Object.setPrototypeOf(fakeFileList, FileList.prototype);

  const result = serializer.serialize(
    { foo: fakeFileList, bar: 1, baz: [1, 2] },
    {} as never,
  );

  // we can't check with toBe since the internal file arrayBuffer function will prevent this
  // since symbols are not visible for copy operations we check this instead
  expect(result.foo.value).toHaveLength(2);
  expect(result.foo.value[0].value.content[TRANSFERABLE]).toBeTruthy();
  expect(result.foo.value[1].value.content[TRANSFERABLE]).toBeTruthy();

  expect(result).toStrictEqual({
    bar: 1,
    baz: [1, 2],
    foo: {
      "mittwald.flow-remote-core.serializer.name": "FileList",
      value: [
        {
          "mittwald.flow-remote-core.serializer.name": "File",
          value: {
            content: buff1,
            lastModified: 1,
            name: "foo",
            type: "",
          },
        },
        {
          "mittwald.flow-remote-core.serializer.name": "File",
          value: {
            content: buff2,
            lastModified: 2,
            name: "bar",
            type: "",
          },
        },
      ],
    },
  });
});

test("will deserialize structures", async () => {
  const serializer = new FlowThreadSerialization();
  const buff1 = new ArrayBuffer(13);
  const buff2 = new ArrayBuffer(37);

  const payload = {
    bar: 1,
    baz: [1, 2],
    foo: {
      "mittwald.flow-remote-core.serializer.name": "FileList",
      value: [
        {
          "mittwald.flow-remote-core.serializer.name": "File",
          value: {
            content: buff1,
            lastModified: 1,
            name: "foo",
            type: "",
          },
        },
        {
          "mittwald.flow-remote-core.serializer.name": "File",
          value: {
            content: buff2,
            lastModified: 2,
            name: "bar",
            type: "",
          },
        },
      ],
    },
  };

  const result = serializer.deserialize(payload, {} as never) as Record<
    string,
    unknown
  >;
  expect(result).toBeTypeOf("object");
  expect(result.bar).toBe(1);
  expect(result.baz).toStrictEqual([1, 2]);
  expect(result.foo).toMatchObject(
    expect.arrayContaining([
      expect.objectContaining(new File([buff1], "foo", { lastModified: 1 })),
      expect.objectContaining(new File([buff2], "bar", { lastModified: 2 })),
    ]),
  );
});
