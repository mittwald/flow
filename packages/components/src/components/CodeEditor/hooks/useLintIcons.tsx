import { type ReactNode, useLayoutEffect, useRef } from "react";
import {
  IconDanger,
  IconInfo,
  IconWarning,
} from "@/components/Icon/components/icons";

const icons = {
  danger: IconDanger,
  warning: IconWarning,
  info: IconInfo,
};

const toMaskImage = (svg: SVGSVGElement) =>
  `url("data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}")`;

/**
 * CodeMirror creates the lint markers and the diagnostics itself, so they
 * cannot render a Flow icon. The icons of the current icon set are rendered
 * hidden instead, and their SVG reaches the stylesheet as a mask image
 * (`--lint-icon-<status>` on the element they are rendered in) – the markers
 * show the same icons as AlertIcon, a replaced icon set included.
 */
export const useLintIcons = (): ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);

  /* No dependencies: the icon set is a context, so any render may change it. */
  useLayoutEffect(() => {
    const container = containerRef.current;
    const target = container?.parentElement;
    if (!container || !target) {
      return;
    }

    for (const status of Object.keys(icons)) {
      const svg = container.querySelector<SVGSVGElement>(
        `[data-status="${status}"] svg`,
      );
      if (svg) {
        target.style.setProperty(`--lint-icon-${status}`, toMaskImage(svg));
      }
    }
  });

  return (
    <div ref={containerRef} hidden>
      {Object.entries(icons).map(([status, Icon]) => (
        <span key={status} data-status={status}>
          <Icon aria-hidden />
        </span>
      ))}
    </div>
  );
};
