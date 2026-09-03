import { type defaultIconSet } from "@mittwald/flow-icons";
import {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from "react";

export type IconSet = typeof defaultIconSet;

interface Context {
  set?: IconSet;
}

const context = createContext<Context>({ set: undefined });

export const useContextIcon = (icon: keyof IconSet) =>
  useContext(context).set?.[icon];

export const IconSetProvider: FC<PropsWithChildren<Context>> = (props) => {
  const { set, children } = props;
  return <context.Provider value={{ set }}>{children}</context.Provider>;
};
