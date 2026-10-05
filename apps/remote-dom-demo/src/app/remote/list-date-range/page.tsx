"use client";

import {
  BrowserOnly,
  Heading,
  ListItemView,
  resolveDateRangeFilterValue,
  Section,
  Text,
  typedList,
  type DateRangeFilterValue,
} from "@mittwald/flow-remote-react-components";

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

export default function Page() {
  const RunList = typedList<Run>();

  return (
    <BrowserOnly>
      <Section>
        <Heading>Filtered on the client</Heading>
        <RunList.List batchSize={10} aria-label="Cronjob runs">
          <RunList.Filter
            property="startedAt"
            mode="dateRange"
            name="Started"
            dateRangeOptions={{ granularity: "minute" }}
          />
          <RunList.StaticData data={runs} />
          <RunList.Item textValue={(run) => run.cronjob}>
            {(run) => (
              <ListItemView>
                <Heading>{run.cronjob}</Heading>
                <Text>{new Date(run.startedAt).toLocaleString()}</Text>
              </ListItemView>
            )}
          </RunList.Item>
        </RunList.List>
      </Section>
      <Section>
        <Heading>Filtered by the loader</Heading>
        <RunList.List batchSize={10} aria-label="Cronjob runs (loader)">
          <RunList.Filter
            property="startedAt"
            mode="dateRange"
            name="Started"
            priority="secondary"
            dateRangeOptions={{ granularity: "minute" }}
          />
          <RunList.LoaderAsync manualFiltering>
            {async (options) => {
              const [range] = (options?.filtering?.startedAt?.values ??
                []) as DateRangeFilterValue[];
              const data = runs.filter((run) => isInRange(run, range));
              return { data, itemTotalCount: data.length };
            }}
          </RunList.LoaderAsync>
          <RunList.Item textValue={(run) => run.cronjob}>
            {(run) => (
              <ListItemView>
                <Heading>{run.cronjob}</Heading>
                <Text>{new Date(run.startedAt).toLocaleString()}</Text>
              </ListItemView>
            )}
          </RunList.Item>
        </RunList.List>
      </Section>
    </BrowserOnly>
  );
}
