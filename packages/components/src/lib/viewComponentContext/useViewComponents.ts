import { useContext } from "react";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

export const useViewComponents = <T extends keyof FlowViewComponents>(
  name: T,
): Partial<FlowViewComponents[T]> =>
  useContext(viewComponentContext)[name] ?? {};
