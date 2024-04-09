import type { ElementType, ReactNode } from "react";
import { deepFindOfType } from "@/lib/react/deepFindOfType";

export const deepHas = (
  children: ReactNode | ReactNode[],
  searchType: ElementType,
): boolean => !!deepFindOfType(children, searchType);
