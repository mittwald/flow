import { components } from "@/components";
import type { RemoteComponentsMap } from "@/lib/types";
import type { RemoteComponentRendererProps } from "@mittwald/remote-dom-react/host";
import { type ComponentType, useMemo } from "react";
import { reduce } from "remeda";

export const useMergedComponents = (
  integrations: RemoteComponentsMap<never>[],
) =>
  useMemo(
    () =>
      new Map<string, ComponentType<RemoteComponentRendererProps>>(
        Object.entries(
          reduce(
            [...integrations, components],
            (merged, current) => ({
              ...merged,
              ...current,
            }),
            {},
          ),
        ),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- compare the integrations by content, not by array identity
    [...integrations],
  );
