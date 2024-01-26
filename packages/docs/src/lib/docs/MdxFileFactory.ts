import { MDXRemoteSerializeResult } from "next-mdx-remote";
import * as path from "path";
import { serialize } from "next-mdx-remote/serialize";
import jetpack from "fs-jetpack";
import {
  MdxFile,
  MdxFileExamples,
  MdxFileMeta,
  StaticParams,
} from "@/lib/docs/MdxFile";
import { Metadata } from "next";

export class MdxFileFactory {
  public static async fromDir(dir: string): Promise<MdxFile[]> {
    return Promise.all(
      jetpack
        .find(dir, { matching: "**/index.mdx" })
        .map((f) => MdxFileFactory.fromFile(f, dir)),
    );
  }

  public static async fromParams(
    dir: string,
    params: StaticParams,
  ): Promise<MdxFile> {
    const all = await MdxFileFactory.fromDir(dir);
    const matching = all.find((mdx) => mdx.matchesSlugs(params.slug));
    if (!matching) {
      throw new Error("Could not find doc file");
    }
    return matching;
  }

  public static async generateStaticParams(
    docsFolder: string,
  ): Promise<Array<StaticParams>> {
    const mdxFiles = await MdxFileFactory.fromDir(docsFolder);
    return mdxFiles.map((mdx) => ({
      slug: mdx.slugs,
    }));
  }

  public static async generateMetadata(
    docsFolder: string,
    params: StaticParams,
  ): Promise<Metadata> {
    const mdxFile = await MdxFileFactory.fromParams(docsFolder, params);
    return {
      title: mdxFile.getTitle(),
    };
  }

  public static async fromFile(
    filename: string,
    baseDir?: string,
  ): Promise<MdxFile> {
    const relativeFilename = path.relative(baseDir ?? "", filename);
    const slugs = relativeFilename.split("/").slice(0, -1);
    const pathname = slugs.join("/");

    const mdxSource = await MdxFileFactory.getMdxSource(filename);
    const examples = MdxFileFactory.getExamples(filename);

    return new MdxFile(relativeFilename, slugs, pathname, mdxSource, examples);
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
