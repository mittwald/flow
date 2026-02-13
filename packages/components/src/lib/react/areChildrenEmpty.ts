import type { ReactNodeWithRenderFn } from "@/lib/react/components/Render";

const isNullish = (children: ReactNodeWithRenderFn) =>
  children === null || children === undefined || children === false;

export const areChildrenEmpty = (children: ReactNodeWithRenderFn): boolean => {
  if (isNullish(children)) {
    return true;
  }

  if (Array.isArray(children)) {
    return children.length === 0 || children.every(isNullish);
  }

  return false;
};
