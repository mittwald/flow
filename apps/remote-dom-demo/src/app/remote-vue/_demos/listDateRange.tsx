/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Heading,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListLoaderAsync,
  ListStaticData,
  resolveDateRangeFilterValue,
  Section,
  Text,
  type DateRangeFilterValue,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/**
 * The `list-date-range` demo as a Vue remote app — the counterpart of
 * `src/app/remote/list-date-range/page.tsx`.
 */
interface Run {
  id: string;
  cronjob: string;
  startedAt: string;
}

const now = new Date();
now.setSeconds(0, 0);

const minutesAgo = (minutes: number) =>
  new Date(now.getTime() - minutes * 60_000).toISOString();

const runs: Run[] = [
  { id: "1", cronjob: "Database backup", startedAt: minutesAgo(20) },
  { id: "2", cronjob: "Clear cache", startedAt: minutesAgo(3 * 60) },
  { id: "3", cronjob: "Generate sitemap", startedAt: minutesAgo(9 * 60) },
  { id: "4", cronjob: "Database backup", startedAt: minutesAgo(26 * 60) },
];

const isInRange = (run: Run, range?: DateRangeFilterValue) => {
  if (!range) {
    return true;
  }
  const { start, end } = resolveDateRangeFilterValue(range);
  const startedAt = new Date(run.startedAt);
  return (!start || startedAt >= start) && (!end || startedAt <= end);
};

const loadRuns = async (options?: {
  filtering?: Record<string, { values?: unknown[] }>;
}) => {
  const [range] = (options?.filtering?.startedAt?.values ??
    []) as DateRangeFilterValue[];
  const data = runs.filter((run) => isInRange(run, range));
  return { data, itemTotalCount: data.length };
};

/* A function, so each list mounts vnodes of its own. */
const runItem = () => (
  <ListItem textValue={(run: Run) => run.cronjob}>
    {{
      default: ({ data }: { data: Run }) => (
        <ListItemView>
          <Heading>{data.cronjob}</Heading>
          <Text>{new Date(data.startedAt).toLocaleString()}</Text>
        </ListItemView>
      ),
    }}
  </ListItem>
);

export const ListDateRangeDemo = defineComponent({
  name: "ListDateRangeDemo",

  setup: () => () => [
    <Section key="client">
      <Heading>Filtered on the client</Heading>
      <List batchSize={10} aria-label="Cronjob runs">
        <ListFilter
          property="startedAt"
          mode="dateRange"
          name="Started"
          dateRangeOptions={{ granularity: "minute" }}
        />
        <ListStaticData data={runs} />
        {runItem()}
      </List>
    </Section>,
    <Section key="loader">
      <Heading>Filtered by the loader</Heading>
      <List batchSize={10} aria-label="Cronjob runs (loader)">
        <ListFilter
          property="startedAt"
          mode="dateRange"
          name="Started"
          priority="secondary"
          dateRangeOptions={{ granularity: "minute" }}
        />
        <ListLoaderAsync loader={loadRuns} manualFiltering />
        {runItem()}
      </List>
    </Section>,
  ],
});
