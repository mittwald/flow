import { Loader } from "next/dynamic";

export interface ImportMapping extends Record<string, Loader<any>> {}
