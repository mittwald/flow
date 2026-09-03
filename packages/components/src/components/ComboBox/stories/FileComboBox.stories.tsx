import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import { ComboBox } from "@/components/ComboBox";
import { Text } from "@/components/Text";
import Section from "@/components/Section";
import InlineCode from "@/components/InlineCode";

const paths: Record<string, string[]> = {
  "/": ["/death-star/", "/millennium-falcon/"],
  "/death-star/": ["/death-star/schematics/", "/death-star/briefings/"],
  "/millennium-falcon/": [
    "/millennium-falcon/schematics/",
    "/millennium-falcon/briefings/",
  ],
  "/death-star/schematics/": [
    "/death-star/schematics/plans.dat",
    "/death-star/schematics/backup.tar",
  ],
  "/death-star/briefings/": [
    "/death-star/briefings/plans.dat",
    "/death-star/briefings/backup.tar",
  ],
  "/millennium-falcon/schematics/": [
    "/millennium-falcon/schematics/plans.dat",
    "/millennium-falcon/schematics/backup.tar",
  ],
  "/millennium-falcon/briefings/": [
    "/millennium-falcon/briefings/plans.dat",
    "/millennium-falcon/briefings/backup.tar",
  ],
};

const sleep = () => new Promise((r) => setTimeout(r, 350));

const getParentPath = (path: string) =>
  path.split("/").slice(0, -1).join("/") + "/";

const checkIsPath = (path: string) => path.endsWith("/");
const checkIsFile = (path: string) => !checkIsPath(path);

const meta: Meta<typeof ComboBox> = {
  title: "Form Controls/ComboBox/FileComboBox",
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
            loadedPaths.map((o) => {
              const trimmedPath = o.endsWith("/") ? o.slice(0, -1) : o;
              const lastPathSegment = trimmedPath.split("/").pop();

              return (
                <Option textValue={o} isDisabled={isLoading} value={o} key={o}>
                  {lastPathSegment}
                </Option>
              );
            })}
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
