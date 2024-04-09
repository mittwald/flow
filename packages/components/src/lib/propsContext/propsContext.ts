import { createContext, useContext } from "react";
import type { PropsContext } from "@/lib/propsContext/types";

export const propsContext = createContext<PropsContext>({});

export const useContextProps = (): PropsContext => useContext(propsContext);
