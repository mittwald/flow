import { hash as objectHash } from "object-code";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import { deepForEach } from "react-children-utilities";
import { avatarColors } from "@/components/Avatar/Avatar";

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
  const number = Math.abs(propsCode % 4);

  return avatarColors[number];
};
