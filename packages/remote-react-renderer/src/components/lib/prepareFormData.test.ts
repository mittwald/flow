import { describe, it, expect, vi, beforeEach } from "vitest";
import { prepareFormData } from "./prepareFormData";
import * as coreFunctions from "@mittwald/flow-core";
import { isFileWithAwaitedArrayBuffer } from "@mittwald/flow-core";

describe("prepareFormData", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps non-file fields unchanged", async () => {
    const formData = new FormData();
    formData.set("title", "hello");
    formData.append("title", "world");

    const addSpy = vi.spyOn(coreFunctions, "addAwaitedArrayBuffer");

    const result = await prepareFormData(formData);

    expect(result.getAll("title")).toEqual(["hello", "world"]);
    expect(addSpy).not.toHaveBeenCalled();
  });

  it("calls addAwaitedArrayBuffer for each file", async () => {
    const formData = new FormData();
    const f1 = new File(["one"], "one.txt", { type: "text/plain" });
    const f2 = new File(["two"], "two.txt", { type: "text/plain" });
    const f3 = new File(["three"], "three.txt", { type: "text/plain" });

    formData.set("singleFile", f1);
    formData.append("files", f2);
    formData.append("files", f3);

    const addSpy = vi.spyOn(coreFunctions, "addAwaitedArrayBuffer");

    const result = await prepareFormData(formData);
    const files = result.getAll("files");
    const singleFile = result.get("singleFile");

    expect(addSpy).toHaveBeenCalledTimes(3);
    expect(addSpy).toHaveBeenNthCalledWith(1, f1);
    expect(addSpy).toHaveBeenNthCalledWith(2, f2);
    expect(addSpy).toHaveBeenNthCalledWith(3, f3);
    expect(singleFile).toEqual(f1);
    expect(files).toEqual([f2, f3]);
    expect(
      [singleFile, ...files].every((f) =>
        isFileWithAwaitedArrayBuffer(f as File),
      ),
    ).toBeTruthy();
  });

  it("does not rewrite mixed field (string + file) and calls addAwaitedArrayBuffer", async () => {
    const formData = new FormData();
    const file = new File(["abc"], "a.txt", { type: "text/plain" });

    formData.append("mixed", "meta");
    formData.append("mixed", file);

    const addSpy = vi.spyOn(coreFunctions, "addAwaitedArrayBuffer");

    const result = await prepareFormData(formData);

    expect(result.getAll("mixed")).toEqual(["meta", file]);
    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(addSpy).toHaveBeenNthCalledWith(1, file);
  });
});
