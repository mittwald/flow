import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { ListItemView, typedList } from "@/components/List";
import type { AsyncDataLoader } from "@/components/List/model/loading/types";
import type { ListPaginationShape } from "@/components/List/model/pagination/types";
import List from "../List";
import { type FC, useState } from "react";

/**
 * Prototype for mstudio#3836 — "Should endless scroll be the default for
 * lists?". Every story below shows the same 460 item list with the same
 * latency; only the way the batches after the first one are loaded differs.
 *
 * Switch between the stories to compare how each strategy feels, and watch the
 * request counter to see what it costs.
 */

interface Domain {
  id: string;
  hostname: string;
  status: string;
}

const cycle = <T,>(values: readonly [T, ...T[]], index: number): T =>
  values[index % values.length] ?? values[0];

const tlds = ["de", "com", "eu", "dev", "shop"] as const;
const statuses = ["Active", "Pending", "Expired"] as const;

const allDomains: Domain[] = Array.from({ length: 460 }, (_, i) => ({
  id: `domain-${i}`,
  hostname: `project-${String(i + 1).padStart(3, "0")}.${cycle(tlds, i)}`,
  status: cycle(statuses, i),
}));

const latency = 600;

const useCountingLoader = (): {
  load: AsyncDataLoader<Domain>;
  requestCount: number;
  loadedItemsCount: number;
} => {
  const [requests, setRequests] = useState<number[]>([]);

  const load: AsyncDataLoader<Domain> = async (opts) => {
    await new Promise((resolve) => setTimeout(resolve, latency));

    const offset = opts?.pagination?.offset ?? 0;
    const limit = opts?.pagination?.limit ?? allDomains.length;
    const data = allDomains.slice(offset, offset + limit);

    setRequests((prev) => [...prev, data.length]);

    return {
      data,
      itemTotalCount: allDomains.length,
    };
  };

  return {
    load,
    requestCount: requests.length,
    loadedItemsCount: requests.reduce((sum, count) => sum + count, 0),
  };
};

interface VariantProps {
  headline: string;
  description: string;
  batchSize: number;
  pagination?: ListPaginationShape;
}

const Variant: FC<VariantProps> = (props) => {
  const { headline, description, batchSize, pagination } = props;
  const DomainList = typedList<Domain>();
  const { load, requestCount, loadedItemsCount } = useCountingLoader();

  return (
    <Section>
      <Heading>{headline}</Heading>
      <Text>{description}</Text>
      <Text>
        <strong>
          {requestCount} requests, {loadedItemsCount} items loaded
        </strong>{" "}
        — batch size {batchSize}, {latency} ms latency per request
      </Text>

      <DomainList.List
        aria-label="Domains"
        batchSize={batchSize}
        pagination={pagination}
      >
        <DomainList.LoaderAsync manualPagination>{load}</DomainList.LoaderAsync>
        <DomainList.Item textValue={(domain) => domain.hostname}>
          {(domain) => (
            <ListItemView>
              <Heading level={3}>{domain.hostname}</Heading>
              <Text>{domain.status}</Text>
            </ListItemView>
          )}
        </DomainList.Item>
      </DomainList.List>
    </Section>
  );
};

const meta: Meta<typeof List> = {
  title: "Structure/List/Pagination Prototype",
  component: List,
  parameters: {
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusQuoButton: Story = {
  name: "Status quo — button, 10 per batch",
  render: () => (
    <Variant
      headline="Status quo"
      description="Every batch is loaded by pressing “Show more”. This is what most mStudio lists do today, and the “only ten more at a time” complaint the discussion started from."
      batchSize={10}
    />
  ),
};

export const StatusQuoInfiniteScroll: Story = {
  name: "Status quo — infinite scroll",
  render: () => (
    <Variant
      headline="Status quo: infinite scroll"
      description="Every batch loads on scroll. Today's opt-in, used by the marketplace and the container templates. The list end is never reachable, so anything below it is out of reach as long as items remain."
      batchSize={10}
      pagination={{ mode: "infiniteScroll" }}
    />
  ),
};

export const HigherLimit: Story = {
  name: "Higher limit — button, 50 per batch",
  render: () => (
    <Variant
      headline="Higher limit"
      description="Unchanged behaviour, larger batches: the button stays, but every press brings 50 items instead of 10. Same number of items reached in a fifth of the presses — at the cost of a larger first payload."
      batchSize={50}
    />
  ),
};

export const HybridAScrollThenButton: Story = {
  name: "Hybrid A — scroll, then button",
  render: () => (
    <Variant
      headline="Hybrid A: scroll, then button"
      description="The first two batches load on scroll, then the button takes over. Browsing starts effortless, and the list end becomes reachable again after 30 items — so the footer and everything below it stay accessible."
      batchSize={10}
      pagination={{ mode: "scrollThenButton", autoLoadBatches: 2 }}
    />
  ),
};

export const HybridBButtonThenScroll: Story = {
  name: "Hybrid B — button, then scroll",
  render: () => (
    <Variant
      headline="Hybrid B: button, then scroll"
      description="The first press of “Show more” switches the list to endless scrolling. Nothing loads without intent, but a user who signals “I want to browse” is not asked again."
      batchSize={10}
      pagination={{ mode: "buttonThenScroll", manualBatches: 1 }}
    />
  ),
};

export const HybridCGrowingBatches: Story = {
  name: "Hybrid C — growing batches",
  render: () => (
    <Variant
      headline="Hybrid C: growing batches"
      description="Button only, but the batches grow: 10 items initially, 50 with every press after that. Keeps the small first payload and the reachable list end, and still gets a browsing user down the list quickly."
      batchSize={10}
      pagination={{ mode: "growingBatches", nextBatchSize: 50 }}
    />
  ),
};
