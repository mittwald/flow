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
    children: ReactNode;
  }> = ({ example, children }) => (
    <DoAndDontTile
      type="do"
      code={example ? mdxFile.getExample(example) : undefined}
    >
      {children}
    </DoAndDontTile>
  );

  const ExampleDont: FC<{
    example?: string;
    children: ReactNode;
  }> = ({ example, children }) => (
    <DoAndDontTile
      type="dont"
      code={example ? mdxFile.getExample(example) : undefined}
    >
      {children}
    </DoAndDontTile>
  );

  const ExampleInfo: FC<{
    example?: string;
    children: ReactNode;
  }> = ({ example, children }) => (
    <DoAndDontTile code={example ? mdxFile.getExample(example) : undefined}>
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
