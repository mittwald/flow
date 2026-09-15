import type { Meta, StoryObj } from "@storybook/react";
import { Suspense, useState, type FC } from "react";
import { Option } from "@/components/Option";
import Select from "../index";
import { Label } from "@/components/Label";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Select> = {
  ...defaultMeta,
  title: "Form Controls/Select/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Select>;

export const ManyOptions: Story = {
  render: (props) => (
    <Select {...props}>
      <Label>Label</Label>
      {Array(20)
        .fill("")
        .map((value, index) => (
          <Option key={index}>Option {index + 1}</Option>
        ))}
    </Select>
  ),
};

export const LongTexts: Story = {
  render: (props) => (
    <Select {...props}>
      <Label>Label</Label>
      {Array(4)
        .fill("")
        .map((value, index) => (
          <Option key={index}>
            Option {index + 1} {dummyText.medium}
          </Option>
        ))}
    </Select>
  ),
};

/*
 * A resource that suspends once per version, so pressing the button makes a
 * component *above* the Select suspend during an update — what a mutation plus
 * cache invalidation produces in a real application. React swaps in the
 * fallback and reveals the Select again once the resource resolves.
 */
const resolvedVersions = new Set<number>();
const pendingVersions = new Map<number, Promise<void>>();

const suspendUntilResolved = (version: number): void => {
  if (version === 0 || resolvedVersions.has(version)) {
    return;
  }

  let pending = pendingVersions.get(version);

  if (!pending) {
    pending = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolvedVersions.add(version);
        resolve();
      }, 400);
    });
    pendingVersions.set(version, pending);
  }

  throw pending;
};

interface SuspendedContentProps {
  version: number;
  onReload: () => void;
}

const SuspendedContent: FC<SuspendedContentProps> = (props) => {
  suspendUntilResolved(props.version);

  return (
    <>
      <Select>
        <Label>Starship</Label>
        <Option value="falcon">Millennium Falcon</Option>
        <Option value="x-wing">X-Wing</Option>
        <Option value="tie">TIE Fighter</Option>
      </Select>
      <button type="button" onClick={props.onReload}>
        Reload (suspends)
      </button>
    </>
  );
};

const SuspendedSelect: FC = () => {
  const [version, setVersion] = useState(0);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuspendedContent
        version={version}
        onReload={() => setVersion((v) => v + 1)}
      />
    </Suspense>
  );
};

/**
 * The Select survives a component above it suspending: React swaps in the
 * fallback and reveals the same Select again once the resource resolves. Used
 * to leave the option collection with a ring-shaped `prevKey`/`nextKey` chain,
 * which froze the tab — see `Option.browser.test.tsx`.
 */
export const Suspended: Story = {
  render: () => <SuspendedSelect />,
};
