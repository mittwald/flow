import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import humanizeString from "humanize-string";

export interface MdxFileMeta {
  title?: string;
  navTitle?: string;
  description?: string;
  component?: string;
  gitHubComponentPath?: string;
}

export type StaticParams =
  | { slug: string[] }
  | { group: string; component: string };

export type MdxFileExamples = Record<string, string>;

export interface SerializedMdxFile {
  filename: string;
  slugs: string[];
  mdxSource: MDXRemoteSerializeResult<never, MdxFileMeta>;
  examples: MdxFileExamples;
  anchors: string[];
}

export class MdxFile {
  public readonly id: string;
  public readonly filename: string;
  public readonly slugs: string[];
  public readonly pathname: string;
  public readonly mdxSource: MDXRemoteSerializeResult<never, MdxFileMeta>;
  private readonly examples: MdxFileExamples;
  public readonly anchors: string[];

  public constructor(
    filename: string,
    slugs: string[],
    mdxSource: MDXRemoteSerializeResult<never, MdxFileMeta>,
    examples: MdxFileExamples,
    anchors: string[],
  ) {
    this.filename = filename;
    this.slugs = slugs;
    this.pathname = MdxFile.pathnameFromSlug(slugs);
    this.id = filename;
    this.mdxSource = mdxSource;
    this.examples = examples;
    this.anchors = anchors;
  }

  public getTitle(): string {
    return (
      this.mdxSource.frontmatter.title ??
      this.mdxSource.frontmatter.component ??
      humanizeString(this.slugs[this.slugs.length - 1] ?? "")
    );
  }

  public getGitHubUrl(): string {
    const component = this.mdxSource.frontmatter.component;

    const gitHubPath =
      this.mdxSource.frontmatter.gitHubComponentPath ??
      `components/${component}`;

    return `https://github.com/mittwald/flow/tree/main/packages/components/src/${gitHubPath}`;
  }

  public getNavTitle(): string {
    return this.mdxSource.frontmatter.navTitle ?? this.getTitle();
  }

  public matchesSlugs(slugs: string[]): boolean {
    return MdxFile.pathnameFromSlug(slugs) === this.pathname;
  }

  public static pathnameFromSlug(slugs: string[]): string {
    return ["", ...slugs].join("/");
  }

  public getExample(name: string): string {
    const example = this.examples[name];
    if (example === undefined) {
      throw new Error(`Could not find example ${name} in ${this.filename}`);
    }
    return example;
  }

  public serialize(): SerializedMdxFile {
    return {
      mdxSource: this.mdxSource,
      examples: this.examples,
      slugs: this.slugs,
      filename: this.filename,
      anchors: this.anchors,
    };
  }

  public static deserialize(serialized: SerializedMdxFile): MdxFile {
    const { filename, mdxSource, examples, slugs, anchors } = serialized;
    return new MdxFile(filename, slugs, mdxSource, examples, anchors);
  }
}
