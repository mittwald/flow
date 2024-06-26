import { hash as objectHash } from "object-code";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import { deepForEach } from "react-children-utilities";

export const getVariantFromChildren = (
  children: ReactNode | undefined,
): number => {
  const identifyingObject: (ReactNode | object)[] = [];

  deepForEach(children, (c) => {
    if (isValidElement(c)) {
      identifyingObject.push({
        props: c.props,
        type: c.type,
      });
    } else {
      identifyingObject.push(c);
    }
  });

  const propsCode = objectHash(identifyingObject);
  return Math.abs(propsCode % 4) + 1;
};
