import { expect, test, describe } from "@jest/globals";
import React, { FC } from "react";
import { deepFilterByType, deepFindOfType } from "./deepFindOfType";

const Needle: FC<{ id?: number }> = () => null;
const Garbage: FC = () => null;

describe("deepFindOfType()", () => {
  test("finds direct children", () => {
    expect(
      deepFindOfType(
        <div>
          <Needle />
        </div>,
        Needle,
      )?.type,
    ).toEqual(Needle);
  });

  test("finds children via string", () => {
    expect(
      deepFindOfType(
        <div>
          <span />
        </div>,
        "span",
      )?.type,
    ).toEqual("span");
  });

  test("not finds not existing children", () => {
    expect(
      deepFindOfType(
        <div>
          <Garbage />
        </div>,
        Needle,
      )?.type,
    ).not.toEqual(Needle);
  });

  test("finds deep nested children", () => {
    expect(
      deepFindOfType(
        <div>
          <div>
            <Needle />
          </div>
        </div>,
        Needle,
      )?.type,
    ).toEqual(Needle);
  });

  test("finds first of multiple children", () => {
    expect(
      deepFindOfType(
        <div>
          <Needle id={1} />
          <Needle id={2} />
          <div>
            <Needle id={3} />
          </div>
        </div>,
        Needle,
      )?.props,
    ).toEqual({ id: 1 });
  });
});

describe("deepFilterByType", () => {
  test("finds direct children", () => {
    expect(
      deepFilterByType(
        <div>
          <Needle />
        </div>,
        Needle,
      ).map((c) => c.type),
    ).toEqual([Needle]);
  });

  test("not finds not existing children", () => {
    expect(
      deepFilterByType(
        <div>
          <Garbage />
        </div>,
        Needle,
      ),
    ).toEqual([]);
  });

  test("finds deep nested children", () => {
    expect(
      deepFilterByType(
        <div>
          <div>
            <Needle />
          </div>
        </div>,
        Needle,
      ).map((c) => c.type),
    ).toEqual([Needle]);
  });

  test("finds all of multiple children", () => {
    expect(
      deepFilterByType(
        <div>
          <Needle />
          <div>
            <Needle />
          </div>
        </div>,
        Needle,
      ).map((c) => c.type),
    ).toEqual([Needle, Needle]);
  });
});
