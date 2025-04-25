const isNullish = (children: React.ReactNode) =>
  children === null || children === undefined || children === false;

export const areChildrenEmpty = (children: React.ReactNode): boolean => {
  if (isNullish(children)) {
    return true;
  }

  if (Array.isArray(children)) {
    return children.length === 0 || children.every(isNullish);
  }

  return false;
};
