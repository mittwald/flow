import { expect, test } from "@jest/globals";
import resolveDynamicProps from "./resolveDynamicProps";
import { dynamic } from "@/lib/propsContext";

test("Dynamic prop will be resolved", () => {
  expect(
    resolveDynamicProps<"button">(
      { isDisabled: dynamic((p) => p.type === "submit") },
      {
        type: "submit",
      },
    ),
  ).toEqual({
    isDisabled: true,
  });

  expect(
    resolveDynamicProps<"button">(
      { isDisabled: dynamic((p) => p.type === "reset") },
      {
        type: "submit",
      },
    ),
  ).toEqual({
    isDisabled: false,
  });
});

test("Dynamic prop with undefined result works", () => {
  const resolved = resolveDynamicProps<"button">(
    { isDisabled: dynamic(() => undefined) },
    {
      type: "submit",
    },
  );

  expect(resolved).toEqual({});
});
