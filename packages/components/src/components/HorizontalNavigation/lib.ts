/**
 * Tolerance for sub-pixel rounding differences between measured item widths and
 * the available width.
 */
const floatTolerance = 0.5;

/**
 * Returns the number of items (counted from the start) that fit into the
 * available width. When not all items fit, the width of the "more" item is
 * reserved, so the overflow trigger can be displayed next to the visible
 * items.
 */
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
