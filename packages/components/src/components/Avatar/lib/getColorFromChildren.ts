import { hash as objectHash } from "object-code";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import { deepForEach } from "react-children-utilities";
import type { AvatarColors } from "@/components/Avatar/Avatar";
import { avatarColors } from "@/components/Avatar/Avatar";

export const getColorFromChildren = (
  children: ReactNode | undefined,
): AvatarColors => {
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
  const number = Math.abs(propsCode % (avatarColors.length - 1));

  return avatarColors[number] ?? "blue";
};
