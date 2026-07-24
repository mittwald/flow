/**
 * Tolerance for sub-pixel rounding differences between measured item widths and
 * the available width.
 */
const floatTolerance = 0.5;

export const getVisibleItemCount = (
  itemWidths: number[],
  availableWidth: number,
  moreItemWidth: number,
): number => {
  const totalWidth = itemWidths.reduce((sum, width) => sum + width, 0);

  if (totalWidth <= availableWidth + floatTolerance) {
    return itemWidths.length;
  }

  let usedWidth = moreItemWidth;
  let visibleCount = 0;

  for (const itemWidth of itemWidths) {
    if (usedWidth + itemWidth > availableWidth + floatTolerance) {
      break;
    }
    usedWidth += itemWidth;
    visibleCount++;
  }

  return visibleCount;
};
