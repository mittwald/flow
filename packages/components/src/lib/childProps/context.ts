import { createContext } from "react";
import type { ChildPropsStore } from "~/lib/childProps/ChildPropsStore";

type ChildPropsContext = Record<string, ChildPropsStore>;

export const childPropsContext = createContext<ChildPropsContext>({});
