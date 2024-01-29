import mergePropsContext from "./mergePropsContext";
import { expect, test } from "@jest/globals";
import { PropsContext } from "@/lib/propsContext";

test.each<{ first: PropsContext; second: PropsContext; merged: PropsContext }>([
  { first: {}, second: {}, merged: {} },
  {
    first: {
      Button: {
        type: "submit",
      },
    },
    second: {},
    merged: {
      Button: {
        type: "submit",
      },
    },
  },
  {
    first: {
      Button: {
        type: "submit",
      },
    },
    second: {
      Button: {
        type: "reset",
      },
    },
    merged: {
      Button: {
        type: "reset",
      },
    },
  },
  {
    first: {
      Button: {
        type: "submit",
      },
    },
    second: {
      Button: {
        type: "reset",
        isDisabled: true,
      },
      Text: {
        rel: "price",
      },
    },
    merged: {
      Button: {
        type: "reset",
        isDisabled: true,
      },
      Text: {
        rel: "price",
      },
    },
  },
  {
    first: {
      Button: {
        className: "first-class",
      },
    },
    second: {
      Button: {
        className: "second-class",
      },
    },
    merged: {
      Button: {
        className: "first-class second-class",
      },
    },
  },
])(
  "Expect merged result is correct for test case: %o",
  ({ first, second, merged }) => {
    expect(mergePropsContext(first, second)).toEqual(merged);
  },
);
