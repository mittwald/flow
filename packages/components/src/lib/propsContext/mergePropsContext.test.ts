import mergePropsContext from "./mergePropsContext";
import { expect, test } from "@jest/globals";
import { PropsContext } from "@/lib/propsContext";

test.each<{ first: PropsContext; second: PropsContext; merged: PropsContext }>([
  { first: {}, second: {}, merged: {} },
  {
    first: {
      button: {
        type: "submit",
      },
    },
    second: {},
    merged: {
      button: {
        type: "submit",
      },
    },
  },
  {
    first: {
      button: {
        type: "submit",
      },
    },
    second: {
      button: {
        type: "reset",
      },
    },
    merged: {
      button: {
        type: "reset",
      },
    },
  },
  {
    first: {
      button: {
        type: "submit",
      },
    },
    second: {
      button: {
        type: "reset",
        isDisabled: true,
      },
      text: {
        rel: "price",
      },
    },
    merged: {
      button: {
        type: "reset",
        isDisabled: true,
      },
      text: {
        rel: "price",
      },
    },
  },
])(
  "Expect merged result is correct for test case: %o",
  ({ first, second, merged }) => {
    expect(mergePropsContext(first, second)).toEqual(merged);
  },
);
