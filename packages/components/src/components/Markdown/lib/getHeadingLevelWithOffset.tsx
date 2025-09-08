export const getHeadingLevelWithOffset = (level: number, offset: number) => {
  const levelWithOffset = level + offset;
  return levelWithOffset > 6 ? 6 : levelWithOffset < 1 ? 1 : levelWithOffset;
};
