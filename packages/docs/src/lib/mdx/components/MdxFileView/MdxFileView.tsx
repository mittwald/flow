"use client";
import type { FC, ReactNode } from "react";
import { MDXRemote as NextMDXRemote } from "next-mdx-remote";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { customComponents } from "@/lib/mdx/components/MdxFileView/customComponents";
import styles from "./customComponents.module.css";
import type { LiveCodeEditorProps } from "@/lib/liveCode/components/LiveCodeEditor/types";
import DoAndDontTile from "@/lib/mdx/components/DoAndDont/DoAndDontTile";

interface Props {
  mdxFile: SerializedMdxFile;
}

export const MdxFileView: FC<Props> = (props) => {
  const mdxFile = MdxFile.deserialize(props.mdxFile);

  const ExampleLiveCodeEditor: FC<
    {
      example?: string;
    } & Omit<LiveCodeEditorProps, "code" | "className">
  > = ({ example = "default", ...rest }) => (
    <LiveCodeEditor
      className={styles.liveCodeEditor}
      code={mdxFile.getExample(example)}
      {...rest}
    />
  );

  const ExampleDo: FC<{
    example?: string;
    exampleText?: string;
    zoom?: number;
    inverse?: boolean;
    children: ReactNode;
  }> = ({ example, exampleText, zoom, inverse, children }) => (
    <DoAndDontTile
      type="do"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      inverse={inverse}
    >
      {children}
    </DoAndDontTile>
  );

  const ExampleDont: FC<{
    example?: string;
    exampleText?: string;
    zoom?: number;
    inverse?: boolean;
    children: ReactNode;
  }> = ({ example, exampleText, zoom, inverse, children }) => (
    <DoAndDontTile
      type="dont"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      inverse={inverse}
    >
      {children}
    </DoAndDontTile>
  );

  const ExampleInfo: FC<{
    example?: string;
    exampleText?: string;
    zoom?: number;
    inverse?: boolean;
    children: ReactNode;
  }> = ({ example, exampleText, zoom, inverse, children }) => (
    <DoAndDontTile
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      inverse={inverse}
    >
      {children}
    </DoAndDontTile>
  );

  return (
    <NextMDXRemote
      {...mdxFile.mdxSource}
      components={{
        LiveCodeEditor: ExampleLiveCodeEditor,
        Do: ExampleDo,
        Dont: ExampleDont,
        Info: ExampleInfo,
        ...customComponents,
      }}
    />
  );
};

export default MdxFileView;
