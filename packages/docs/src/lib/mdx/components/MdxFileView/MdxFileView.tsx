"use client";
import type { FC } from "react";
import { MDXRemote as NextMDXRemote } from "next-mdx-remote";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { customComponents } from "@/lib/mdx/components/MdxFileView/customComponents";
import styles from "./customComponents.module.css";
import type { LiveCodeEditorProps } from "@/lib/liveCode/components/LiveCodeEditor/types";

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

  return (
    <NextMDXRemote
      {...mdxFile.mdxSource}
      components={{
        LiveCodeEditor: ExampleLiveCodeEditor,
        ...customComponents,
      }}
    />
  );
};

export default MdxFileView;
