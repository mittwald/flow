import { type SVGProps, useEffect, useRef, useState } from "react";
import { useCallbackRef } from "use-callback-ref";

/** @internal * */
export type ViewDimensions = Pick<
  SVGProps<SVGForeignObjectElement>,
  "x" | "y" | "width" | "height"
> | null;

/** @internal * */
export const useChartClipRect = () => {
  const observerRef = useRef<MutationObserver>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [viewDimensions, setViewDimensions] = useState<ViewDimensions>(null);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  const attachContainerRef = useCallbackRef(
    null,
    (div: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      const svg = div?.querySelector("svg") ?? null;
      svgRef.current = svg;

      if (!svg) {
        return;
      }

      const clipRect = svg.querySelector(
        "clipPath rect",
      ) as SVGRectElement | null;
      if (!clipRect) {
        return;
      }

      const observer = new MutationObserver((mutations) => {
        const newViewDimensions: ViewDimensions = mutations.reduce(
          (acc, mutation) => {
            if (mutation.type !== "attributes" || !mutation.attributeName) {
              return acc;
            }

            const target = mutation.target as SVGRectElement;
            const attr = mutation.attributeName as keyof ViewDimensions;
            const value = target.getAttribute(attr);

            if (value) {
              acc = {
                ...acc,
                [attr]: value,
              };
            }

            return acc;
          },
          viewDimensions ?? { x: "0", y: "0", width: "0", height: "0" },
        );

        setViewDimensions(newViewDimensions);
      });

      observer.observe(clipRect, {
        attributes: true,
        attributeFilter: ["x", "y", "width", "height"],
        attributeOldValue: false,
        childList: false,
        subtree: false,
      });

      observerRef.current = observer;
    },
  );

  return { viewDimensions, ref: attachContainerRef };
};
