import type { LinkProps } from "@/components/Link/index";
import { createContext } from "react";

interface LinkContext {
  linkComponent?: LinkProps["linkComponent"];
}

export const linkContext = createContext<LinkContext>({});

export const LinkContextProvider = linkContext.Provider;
