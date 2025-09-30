import { createContext, useContext } from "react";
import type {
  ComponentPropsContext,
  PropsContext,
} from "@/lib/propsContext/types";
import type { FlowComponentName } from "@/components/propTypes";

export const propsContext = createContext<PropsContext>({});

export const PropsContextProvider = propsContext.Provider;

export const usePropsContext = (): PropsContext => useContext(propsContext);

export const useComponentPropsContext = <C extends FlowComponentName>(
  component: C,
) => usePropsContext()[component] as ComponentPropsContext<C> | undefined;
