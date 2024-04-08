import { createContext } from "react";
import type { PropsContext } from "@/lib/propsContext/types";

export const propsContext = createContext<PropsContext>({});
