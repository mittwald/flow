import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import * as path from "path";
import { serialize } from "next-mdx-remote/serialize";
import jetpack from "fs-jetpack";
import type {
  MdxFileExamples,
  MdxFileMeta,
  StaticParams,
} from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import type { Metadata } from "next";
import remarkGfm from "remark-gfm";

export class MdxFileFactory {
  public static async fromDir(
    dir: string,
    fileName = "index",
  ): Promise<MdxFile[]> {
    return Promise.all(
      jetpack
        .find(dir, { matching: `**/${fileName}.mdx` })
        .map((f) => MdxFileFactory.fromFile(f, dir)),
    );
  }

  public static async fromParams(
    dir: string,
    params: StaticParams,
    fileName?: string,
  ): Promise<MdxFile | undefined> {
    const all = await MdxFileFactory.fromDir(dir, fileName);

    const matching = all.find((mdx) =>
      mdx.matchesSlugs(
        "slug" in params ? params.slug : [params.group, params.component],
      ),
    );
    if (!matching) {
      return undefined;
    }
    return matching;
  }

  public static async generateStaticParams(contentFolder: string) {
    const mdxFiles = await MdxFileFactory.fromDir(contentFolder);

    return mdxFiles.map((mdx) =>
      contentFolder.includes("03-components")
        ? {
            group: mdx.slugs[0],
            component: mdx.slugs[1],
          }
        : {
            slug: mdx.slugs,
          },
    );
  }

  public static async generateMetadata(
    contentFolder: string,
    params: StaticParams,
  ): Promise<Metadata> {
    const mdxFile = await MdxFileFactory.fromParams(contentFolder, params);
    return {
      title: mdxFile?.getTitle(),
    };
  }

  public static async fromFile(
    filename: string,
    baseDir?: string,
  ): Promise<MdxFile> {
    const relativeFilename = path.relative(baseDir ?? "", filename);
    const slugs = relativeFilename.split("/").slice(0, -1);

    const mdxSource = await MdxFileFactory.getMdxSource(filename);

    const anchors = MdxFileFactory.getAnchors(filename);

    const examples = MdxFileFactory.getExamples(filename);

    return new MdxFile(relativeFilename, slugs, mdxSource, examples, anchors);
  }

  private static getAnchors(filename: string) {
    const fileContent = jetpack.read(filename);
    if (!fileContent) {
      throw new Error(`Could not read file: ${filename}`);
    }
    return fileContent
      .split("\n")
      .filter((line) => line.startsWith("# "))
      .map((line) => line.substring(2).trim());
  }

  private static async getMdxSource(
    filename: string,
  ): Promise<MDXRemoteSerializeResult<never, MdxFileMeta>> {
    const fileContent = jetpack.read(filename);
    if (!fileContent) {
      throw new Error(`Could not read file: ${filename}`);
    }
    return serialize<never, MdxFileMeta>(fileContent, {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    });
  }

  private static getExamples(filename: string): MdxFileExamples {
    const exampleExt = ".tsx";

    const exampleFiles = jetpack.find(path.dirname(filename), {
      matching: `examples/*${exampleExt}`,
    });

    const getExampleName = (exampleFile: string) =>
      path.basename(exampleFile, exampleExt);

    return Object.fromEntries(
      exampleFiles.map((f) => [getExampleName(f), jetpack.read(f) ?? ""]),
    );
  }
}
