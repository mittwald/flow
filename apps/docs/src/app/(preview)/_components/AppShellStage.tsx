"use client";

import type { FC } from "react";
import type { AppShellName } from "@/lib/mdx/components/AppShellPreview";
import { appShellComponents } from "@/lib/mdx/components/AppShellPreview/appShellComponents";

interface Props {
  example: AppShellName;
}

/**
 * Renders one App Shell at full size.
 *
 * A client component because the shells reach for client-only APIs while their
 * module is evaluated (`typedList()`), which a server component may not even
 * import.
 */
export const AppShellStage: FC<Props> = ({ example }) => {
  const Shell = appShellComponents[example];

  return <Shell />;
};
