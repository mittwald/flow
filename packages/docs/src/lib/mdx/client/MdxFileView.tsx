"use client";
import PropertiesTable from "@/lib/PropertiesTable";
import { FC } from "react";
import { MDXRemote as NextMDXRemote } from "next-mdx-remote";
import LiveCodeEditor from "@/lib/LiveCodeEditor/component/LiveCodeEditor";
import { MdxFile, SerializedMdxFile } from "@/lib/mdx/MdxFile";

interface Props {
  mdxFile: SerializedMdxFile;
}

export const MdxFileView: FC<Props> = (props) => {
  const mdxFile = MdxFile.deserialize(props.mdxFile);

  const ExampleLiveCodeEditor: FC<{ example?: string }> = ({
    example = "default",
  }) => <LiveCodeEditor code={mdxFile.getExample(example)} />;

  const ExamplePropertiesTable = () => (
    <PropertiesTable name={mdxFile.getTitle()} />
  );

  return (
    <NextMDXRemote
      {...mdxFile.mdxSource}
      components={{
        LiveCodeEditor: ExampleLiveCodeEditor,
        PropertiesTable: ExamplePropertiesTable,
      }}
    />
  );
};

export default MdxFileView;
