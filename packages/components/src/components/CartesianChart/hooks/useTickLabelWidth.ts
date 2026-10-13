import {
  type RefCallback,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const measureLabel = (label: SVGTextElement): number => {
  try {
    return label.getBBox().width;
  } catch {
    // Firefox throws for an element that is not rendered.
    return 0;
  }
};

/**
 * Measures the widest tick label of an axis, for an axis that sizes itself to
 * its labels.
 *
 * Replaces recharts' own `width="auto"` measurement, which undersizes the axis
 * in two ways. It reads `getBoundingClientRect()` — screen pixels, which a CSS
 * `zoom` or `transform` on an ancestor scales — and uses the result as SVG user
 * units. And it measures once, so a web font that replaces its fallback after
 * mount widens the labels past the axis. `getBBox()` measures in user units,
 * and a finished font load measures again.
 *
 * Attach the returned ref to every tick label. The width is `undefined` until a
 * label has been measured.
 *
 * @internal
 */
export const useTickLabelWidth = () => {
  const labels = useRef(new Set<SVGTextElement>());
  const [width, setWidth] = useState<number>();

  const measure = useCallback(() => {
    const widest = Math.max(0, ...[...labels.current].map(measureLabel));
    setWidth(widest > 0 ? Math.ceil(widest) : undefined);
  }, []);

  useEffect(() => {
    const fonts = document.fonts;
    fonts.addEventListener("loadingdone", measure);
    return () => fonts.removeEventListener("loadingdone", measure);
  }, [measure]);

  const labelRef: RefCallback<SVGTextElement> = useCallback(
    (label) => {
      if (!label) {
        return;
      }
      labels.current.add(label);
      measure();
      return () => {
        labels.current.delete(label);
        measure();
      };
    },
    [measure],
  );

  return { width, labelRef };
};
