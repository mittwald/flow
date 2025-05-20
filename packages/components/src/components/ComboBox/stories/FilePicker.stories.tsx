import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import { ComboBox } from "@/components/ComboBox";
import { Text } from "@/components/Text";
import Section from "@/components/Section";
import InlineCode from "@/components/InlineCode";

const paths: Record<string, string[]> = {
  "/": ["/project-42/", "/project-7/"],
  "/project-42/": ["/project-42/dir-1/", "/project-42/dir-2/"],
  "/project-7/": ["/project-7/dir-1/", "/project-7/dir-2/"],
  "/project-42/dir-1/": [
    "/project-42/dir-1/sql.dat",
    "/project-42/dir-1/backup.tar",
  ],
  "/project-42/dir-2/": [
    "/project-42/dir-2/sql.dat",
    "/project-42/dir-2/backup.tar",
  ],
  "/project-7/dir-1/": [
    "/project-7/dir-1/sql.dat",
    "/project-7/dir-1/backup.tar",
  ],
  "/project-7/dir-2/": [
    "/project-7/dir-2/sql.dat",
    "/project-7/dir-2/backup.tar",
  ],
};

const sleep = () => new Promise((r) => setTimeout(r, 350));

const getParentPath = (path: string) =>
  path.split("/").slice(0, -1).join("/") + "/";

const checkIsPath = (path: string) => path.endsWith("/");
const checkIsFile = (path: string) => !checkIsPath(path);

const meta: Meta<typeof ComboBox> = {
  title: "Form Controls/ComboBox/Examples/FilePicker",
  component: ComboBox,
  render: (props) => {
    const [value, setValue] = useState("/");
    const [selectedPath, setSelectedPath] = useState("/");
    const [inputValue, setInputValue] = useState("/");
    const [isLoading, setIsloading] = useState(true);
    const [loadedPaths, setLoadedPaths] = useState<string[]>([]);

    useEffect(() => {
      let aborted = false;

      const loadPaths = async (path: string) => {
        setIsloading(true);
        await sleep();
        if (aborted) {
          return;
        }
        setIsloading(false);
        setLoadedPaths(paths[path] ?? []);
      };

      loadPaths(selectedPath).catch(console.error);

      return () => {
        aborted = true;
      };
    }, [selectedPath]);

    return (
      <Section>
        <ComboBox
          {...props}
          defaultInputValue={selectedPath}
          inputValue={inputValue}
          allowsCustomValue
          allowsEmptyCollection
          selectedKey={null}
          onChange={setValue}
          renderEmptyState={
            checkIsFile(selectedPath)
              ? undefined
              : () =>
                  isLoading ? <Text>Loading...</Text> : <Text>Not found</Text>
          }
          onInputChange={(input) => {
            setSelectedPath(getParentPath(input));
            setInputValue(input);
          }}
          onSelectionChange={(selection) => {
            const path = String(selection ?? "/");
            setSelectedPath(path);
            setInputValue(path);
          }}
        >
          <Label>Select file</Label>
          {checkIsPath(selectedPath) &&
            loadedPaths.map((o) => (
              <Option isDisabled={isLoading} value={o} key={o}>
                {o}
              </Option>
            ))}
        </ComboBox>
        <Text>
          Selected value: <InlineCode>{value}</InlineCode>
        </Text>
      </Section>
    );
  },
};
export default meta;

type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {};
