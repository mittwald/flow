"use client";
import type { FC } from "react";
import { MDXRemote as NextMDXRemote } from "next-mdx-remote";
import type { LiveCodeEditorProps } from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import LiveCodeEditor from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import type { SerializedMdxFile } from "@/lib/mdx/MdxFile";
import { MdxFile } from "@/lib/mdx/MdxFile";
import { customComponents } from "@/lib/mdx/components/MdxFileView/customComponents";
import styles from "./customComponents.module.css";
import type { DoAndDontTileProps } from "@/lib/mdx/components/DoAndDont/DoAndDontTile";
import DoAndDontTile from "@/lib/mdx/components/DoAndDont/DoAndDontTile";

interface Props {
  mdxFile: SerializedMdxFile;
}

interface ExampleProps extends DoAndDontTileProps {
  example?: string;
  exampleText?: string;
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

  const ExampleDo: FC<ExampleProps> = ({
    example,
    exampleText,
    zoom,
    bgColor,
    mobile,
    children,
    heading,
  }) => (
    <DoAndDontTile
      type="do"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </DoAndDontTile>
  );

  const ExampleDont: FC<ExampleProps> = ({
    example,
    exampleText,
    zoom,
    bgColor,
    mobile,
    children,
    heading,
  }) => (
    <DoAndDontTile
      type="dont"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </DoAndDontTile>
  );

  const ExampleInfo: FC<ExampleProps> = ({
    example,
    exampleText,
    zoom,
    bgColor,
    mobile,
    children,
    heading,
  }) => (
    <DoAndDontTile
      type="info"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </DoAndDontTile>
  );
  const ExampleStudio: FC<ExampleProps> = ({
    example,
    exampleText,
    zoom,
    bgColor,
    mobile,
    children,
    heading,
  }) => (
    <DoAndDontTile
      type="mstudio"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </DoAndDontTile>
  );
  const ExamplePlain: FC<ExampleProps> = ({
    example,
    exampleText,
    zoom,
    bgColor,
    mobile,
    children,
    heading,
  }) => (
    <DoAndDontTile
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
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
        MStudioTile: ExampleStudio,
        PlainTile: ExamplePlain,
        ...customComponents,
      }}
    />
  );
};

export default MdxFileView;
