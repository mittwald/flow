import { hash as objectHash } from "object-code";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import { deepForEach } from "react-children-utilities";

export const getColorFromChildren = (
  children: ReactNode | undefined,
): "blue" | "teal" | "green" | "violet" | "lilac" => {
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
  const number = Math.abs(propsCode % 4) + 1;

  return number === 1
    ? "blue"
    : number === 2
      ? "teal"
      : number === 3
        ? "green"
        : number === 4
          ? "violet"
          : "lilac";
};
