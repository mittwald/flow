"use server";

import { globSync } from "glob";
import path from "path";
import * as R from "remeda";

export type UseServerGetComponentModules = {
  pathName: string;
  name: string;
}[];

export const useServerGetComponentModules =
  (): UseServerGetComponentModules => {
    const modules = globSync(
      path.join(process.cwd(), "./src/app/**/page.mdx"),
    ).map((s) => {
      const name = s.replace(/^.+\/(.+)\/page\.mdx$/, "$1");
      return {
        pathName: `/${name}`,
        name: `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
      };
    });

    return R.sortBy(modules, (m) => m.name);
  };
