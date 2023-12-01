import { Loader } from "next/dynamic";

// eslint-disable-next-line
type AnyLoader = Loader<any>;
export interface ImportMapping extends Record<string, AnyLoader> {}
