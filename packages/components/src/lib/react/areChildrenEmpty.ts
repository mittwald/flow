import React from "react";

const isNullish = (children: React.ReactNode) =>
  children === null || children === undefined || children === false;

export const areChildrenEmpty = (children: React.ReactNode): boolean => {
  if (isNullish(children)) {
    return true;
  }

  if (Array.isArray(children)) {
    return children.length === 0 || children.every(isNullish);
  }

  if (typeof children === "string" || typeof children === "number") {
    return false;
  }

  if (React.isValidElement(children)) {
    return false;
  }

  return true;
};
