"use client";
import type { FC } from "react";
import { MDXRemote as NextMDXRemote } from "next-mdx-remote";
import type { LiveCodeEditorProps } from "~/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import LiveCodeEditor from "~/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor";
import { PropertiesTables } from "~/lib/PropertiesTables/PropertiesTables";
import { MdxFile } from "~/lib/mdx/MdxFile";
import type { SerializedMdxFile } from "~/lib/mdx/MdxFile";
import { customComponents } from "~/lib/mdx/components/MdxFileView/customComponents";
import styles from "./customComponents.module.css";
import type { DoAndDontTileProps } from "~/lib/mdx/components/DoAndDont/ExampleTile";
import ExampleTile from "~/lib/mdx/components/DoAndDont/ExampleTile";

interface Props {
  mdxFile: SerializedMdxFile;
  indexFile?: SerializedMdxFile;
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
    <ExampleTile
      type="do"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </ExampleTile>
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
    <ExampleTile
      type="dont"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </ExampleTile>
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
    <ExampleTile
      type="info"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </ExampleTile>
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
    <ExampleTile
      type="mstudio"
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </ExampleTile>
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
    <ExampleTile
      text={exampleText}
      code={example ? mdxFile.getExample(example) : undefined}
      zoom={zoom}
      bgColor={bgColor}
      mobile={mobile}
      heading={heading}
    >
      {children}
    </ExampleTile>
  );

  const ExamplePropertiesTables = () => (
    <PropertiesTables
      name={
        props.indexFile?.mdxSource.frontmatter?.component || mdxFile.getTitle()
      }
    />
  );

  return (
    <NextMDXRemote
      {...mdxFile.mdxSource}
      components={
        {
          LiveCodeEditor: ExampleLiveCodeEditor,
          PropertiesTables: ExamplePropertiesTables,
          Do: ExampleDo,
          Dont: ExampleDont,
          Info: ExampleInfo,
          MStudio: ExampleStudio,
          Plain: ExamplePlain,
          ...customComponents,
          // @todo: remove when MDXRemote types are fixed
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } as any
      }
    />
  );
};

export default MdxFileView;
