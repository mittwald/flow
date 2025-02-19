import type { MdxFile } from "@/lib/mdx/MdxFile";

export interface MdxDirectoryTree {
  [key: string]: MdxFile | MdxDirectoryTree;
}

export const buildDirectoryTree = (
  docs: MdxFile[],
  path = "/",
): MdxDirectoryTree => {
  const result: MdxDirectoryTree = {};
  const docsMatchingPath = docs.filter((d) => d.pathname.startsWith(path));

  for (const doc of docsMatchingPath) {
    const subPath = doc.pathname.slice(path.length);
    const subPathParts = subPath.split("/");
    const directSubPathPath = subPathParts[0];

    if (!directSubPathPath) {
      continue;
    }

    if (subPathParts.length === 1) {
      result[directSubPathPath] = doc;
    } else {
      result[directSubPathPath] = buildDirectoryTree(
        docsMatchingPath,
        path + directSubPathPath + "/",
      );
    }
  }

  return result;
};
