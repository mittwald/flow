"use client";
import type { FC, ReactNode } from "react";
import { MDXRemote as NextMDXRemote } from "next-mdx-remote";
import type { LiveCodeEditorProps } from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { customComponents } from "@/lib/mdx/components/MdxFileView/customComponents";
import styles from "./customComponents.module.css";
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
    lightBackground?: boolean;
    darkBackground?: boolean;
    mobile?: boolean;
    children: ReactNode;
  }> = ({
    example,
    exampleText,
    zoom,
    lightBackground,
    darkBackground,
    mobile,
    children,
  }) => (
    <DoAndDontTile
      type="do"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      lightBackground={lightBackground}
      darkBackground={darkBackground}
      mobile={mobile}
    >
      {children}
    </DoAndDontTile>
  );

  const ExampleDont: FC<{
    example?: string;
    exampleText?: string;
    zoom?: number;
    lightBackground?: boolean;
    darkBackground?: boolean;
    mobile?: boolean;
    children: ReactNode;
  }> = ({
    example,
    exampleText,
    zoom,
    lightBackground,
    darkBackground,
    mobile,
    children,
  }) => (
    <DoAndDontTile
      type="dont"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      lightBackground={lightBackground}
      darkBackground={darkBackground}
      mobile={mobile}
    >
      {children}
    </DoAndDontTile>
  );

  const ExampleInfo: FC<{
    example?: string;
    exampleText?: string;
    zoom?: number;
    lightBackground?: boolean;
    darkBackground?: boolean;
    mobile?: boolean;
    children: ReactNode;
  }> = ({
    example,
    exampleText,
    zoom,
    lightBackground,
    darkBackground,
    mobile,
    children,
  }) => (
    <DoAndDontTile
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      lightBackground={lightBackground}
      darkBackground={darkBackground}
      mobile={mobile}
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
