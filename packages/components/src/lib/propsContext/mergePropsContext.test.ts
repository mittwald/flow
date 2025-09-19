import { expect, test } from "vitest";
import mergePropsContext from "./mergePropsContext";
import type { PropsContext } from "@/lib/propsContext";
import { nestingLevelKey } from "@/lib/propsContext/nestedPropsContext/types";

test.each<{
  parentContext: PropsContext;
  context: PropsContext;
  merged: PropsContext;
  currentLevel?: number;
}>([
  { parentContext: {}, context: {}, merged: {} },
  {
    parentContext: {
      Button: {
        type: "submit",
      },
    },
    context: {},
    merged: {
      Button: {
        type: "submit",
      },
    },
  },
  // Inheritance
  {
    currentLevel: 0,
    parentContext: {
      Button: {
        type: "submit",
      },
    },
    context: {},
    merged: {
      Button: {
        type: "submit",
      },
    },
  },
  {
    currentLevel: 1,
    parentContext: {
      Button: {
        type: "submit",
      },
    },
    context: {},
    merged: {},
  },
  {
    currentLevel: 1,
    parentContext: {
      Button: {
        type: "submit",
        ___inherit: true,
      },
    },
    context: {},
    merged: {
      Button: {
        type: "submit",
        ___inherit: true,
      },
    },
  },
  {
    currentLevel: 2,
    parentContext: {
      Button: {
        type: "submit",
        ___inherit: true,
      },
    },
    context: {},
    merged: {
      Button: {
        type: "submit",
        ___inherit: true,
      },
    },
  },
  {
    parentContext: {
      Button: {
        type: "submit",
      },
    },
    context: {
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
    currentLevel: 1,
    parentContext: {
      Button: {
        type: "submit",
      },
    },
    context: {
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
    parentContext: {
      Button: {
        type: "submit",
      },
    },
    context: {
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
    parentContext: {
      Button: {
        className: "first-class",
      },
    },
    context: {
      Button: {
        className: "second-class",
      },
    },
    merged: {
      Button: {
        className: "second-class",
      },
    },
  },
  // Nesting
  {
    parentContext: {
      Button: {
        type: "submit",
      },
      ___nestingLevel: 1,
    },
    context: {
      Button: {
        type: "reset",
      },
    },
    merged: {
      Button: {
        type: "submit",
      },
    },
  },
  {
    parentContext: {
      Button: {
        type: "submit",
      },
      ___nestingLevel: 2,
    },
    context: {
      Button: {
        type: "reset",
      },
    },
    merged: {
      Button: {
        type: "submit",
      },
    },
  },
  {
    parentContext: {
      Button: {
        type: "submit",
      },
      ___nestingLevel: 1,
    },
    context: {
      Button: {
        type: "reset",
      },
      ___nestingLevel: 1,
    },
    merged: {
      Button: {
        type: "reset",
      },
    },
  },
])(
  "Expect merged result is correct for test case: %o",
  ({
    parentContext: first,
    context: second,
    merged: expected,
    currentLevel,
  }) => {
    const merged = mergePropsContext(first, second, currentLevel);
    delete merged[nestingLevelKey];
    expect(merged).toEqual(expected);
  },
);
