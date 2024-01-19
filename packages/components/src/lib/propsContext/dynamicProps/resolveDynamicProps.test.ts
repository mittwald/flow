import { expect, test } from "@jest/globals";
import resolveDynamicProps from "./resolveDynamicProps";
import { dynamic } from "@/lib/propsContext";

test("Dynamic prop will be resolved", () => {
  expect(
    resolveDynamicProps<"Button">(
      { isDisabled: dynamic((p) => p.type === "submit") },
      {
        type: "submit",
      },
    ),
  ).toEqual({
    isDisabled: true,
  });

  expect(
    resolveDynamicProps<"Button">(
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
  const resolved = resolveDynamicProps<"Button">(
    { isDisabled: dynamic(() => undefined) },
    {
      type: "submit",
    },
  );

  expect(resolved).toEqual({});
});
