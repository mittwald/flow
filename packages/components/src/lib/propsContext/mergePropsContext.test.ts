import { expect, test } from "vitest";
import mergePropsContext from "./mergePropsContext";
import type { PropsContext } from "@/lib/propsContext";
import { nestingLevelKey } from "@/lib/propsContext/nestedPropsContext/types";

let ref1Node: unknown = null;
let ref2Node: unknown = null;

const ref1Callback = (node: unknown) => {
  ref1Node = node;
};

const ref2Callback = (node: unknown) => {
  ref2Node = node;
};

const ref1Object = {
  current: null,
};

const ref2Object = {
  current: null,
};

beforeEach(() => {
  ref1Node = null;
  ref2Node = null;
  ref1Object.current = null;
  ref2Object.current = null;
});

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
  {
    parentContext: {
      Button: {
        ref: ref1Callback,
      },
    },
    context: {
      Button: {
        ref: ref2Callback,
      },
    },
    merged: {
      Button: {
        ref: expect.toSatisfy((ref) => {
          const refValue = "hello";
          if (typeof ref !== "function") {
            return false;
          }
          ref(refValue);
          return ref1Node === refValue && ref2Node === refValue;
        }),
      },
    },
  },
  {
    parentContext: {
      ContextMenu: {
        triggerRef: ref1Object,
      },
    },
    context: {
      ContextMenu: {
        triggerRef: ref2Object,
      },
    },
    merged: {
      ContextMenu: {
        triggerRef: expect.toSatisfy((ref) => {
          const refValue = "hello";
          if (typeof ref !== "function") {
            return false;
          }
          ref(refValue);

          return (
            ref1Object.current === refValue && ref2Object.current === refValue
          );
        }),
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
