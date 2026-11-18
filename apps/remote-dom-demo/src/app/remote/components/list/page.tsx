"use client";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
import { demoData } from "@/app/remote/components/list/demoData";
import {
  Action,
  ActionGroup,
  Avatar,
  Badge,
  BrowserOnly,
  Button,
  Content,
  ContextMenu,
  Heading,
  IconEmail,
  Initials,
  List,
  ListItemView,
  MenuItem,
  Modal,
  resolveDateRangeFilterValue,
  Section,
  Text,
  typedList,
  useModalController,
  type DateRangeFilterValue,
} from "@mittwald/flow-remote-react-components";

interface Crew {
  id: string;
  name: string;
  role: string;
  status: string;
}

const crew: Crew[] = [
  { id: "1", name: "Luke Skywalker", role: "Jedi Master", status: "active" },
  { id: "2", name: "Leia Organa", role: "Rebel Pilot", status: "unavailable" },
  { id: "3", name: "Han Solo", role: "Smuggler", status: "active" },
];

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

/**
 * The counterpart of `src/app/remote-vue/_demos/components/list.tsx`.
 *
 * The first list is an async loader that takes its time, two filters, a search,
 * two sortings, tiles, a table view, and a context menu per item that opens
 * that item's own modal. The second one shows selection, which turns every item
 * and table row into a checkbox and therefore cannot share a list with the
 * first one's item links. `ListItemView` is in both. The last two filter by a
 * date range, once on the client and once in the loader.
 */
export default function Page() {
  const DemoList = typedList<(typeof demoData)[number]>();
  const CrewList = typedList<Crew>();
  const RunList = typedList<Run>();

  return (
    <ComponentGroupPage title="List">
      <BrowserOnly>
        <Section>
          <Heading level={3}>List</Heading>
          <List onAction={console.log} batchSize={10} aria-label="Demo">
            <DemoList.LoaderAsync>
              {() => {
                return new Promise((r) => {
                  setTimeout(() => {
                    r({
                      data: demoData,
                      itemTotalCount: demoData.length,
                    });
                  }, 1500);
                });
              }}
            </DemoList.LoaderAsync>

            <DemoList.Filter property="faction" name="Faction" mode="some" />
            {/* `secondary` keeps it out of the header — it lives in the
                all-filters modal, which is what puts that modal on desktop.
                `one` renders it there as a radio group. */}
            <DemoList.Filter
              property="homeworld"
              name="Homeworld"
              mode="one"
              priority="secondary"
            />
            <DemoList.Search />
            <DemoList.Sorting property="name" name="Name" direction="asc" />
            <DemoList.Sorting
              property="name"
              name="Name"
              direction="desc"
              directionName="descending"
            />

            {/* The href makes the host render a real anchor, so the browser's
                context menu, middle-click and modifier-click work on an item. */}
            <DemoList.Item
              textValue={(d) => d.name}
              href={(d) => `#${d.name}`}
              showTiles
            >
              {(d) => {
                const c = useModalController();
                return (
                  <>
                    <ListItemView>
                      <Avatar>
                        <IconEmail />
                      </Avatar>
                      <Heading>
                        {d.name} ({d.faction})
                      </Heading>
                      <Text>{d.bio.slice(0, 100)}</Text>
                      <ContextMenu>
                        <MenuItem onAction={c.open}>
                          <IconEmail />
                          <Text>Send message</Text>
                        </MenuItem>
                      </ContextMenu>
                    </ListItemView>
                    <Modal controller={c}>
                      <Heading>{d.name}</Heading>
                      <Content>
                        <Section>
                          <Heading level={3}>{d.faction}</Heading>
                          <Text>{d.bio}</Text>
                        </Section>
                      </Content>
                      <ActionGroup>
                        <Action closeModal>
                          <Button>Cancel</Button>
                        </Action>
                      </ActionGroup>
                    </Modal>
                  </>
                );
              }}
            </DemoList.Item>

            <DemoList.Table>
              <DemoList.TableHeader>
                <DemoList.TableColumn>Name</DemoList.TableColumn>
              </DemoList.TableHeader>
              <DemoList.TableBody>
                <DemoList.TableRow>
                  <DemoList.TableCell>{(d) => d.name}</DemoList.TableCell>
                </DemoList.TableRow>
              </DemoList.TableBody>
            </DemoList.Table>
          </List>
        </Section>

        <Section>
          <Heading level={3}>List with selection</Heading>
          <CrewList.List
            aria-label="Crew"
            getItemId={(item) => item.id}
            selectedKeys={["2"]}
            selectionMode="multiple"
          >
            <CrewList.StaticData data={crew} />
            <CrewList.Filter property="role" name="Role" />
            <CrewList.Sorting
              property="name"
              name="Alphabetical"
              defaultEnabled
            />
            <CrewList.Item textValue={(item) => item.name}>
              {(item) => (
                <ListItemView>
                  <Avatar>
                    <Initials>{item.name}</Initials>
                  </Avatar>
                  <Heading>
                    {item.name}
                    {item.status === "active" && <Badge>Active</Badge>}
                  </Heading>
                  <Text>{item.role}</Text>
                  <ContextMenu>
                    <MenuItem>Show details</MenuItem>
                    <MenuItem>Delete</MenuItem>
                  </ContextMenu>
                </ListItemView>
              )}
            </CrewList.Item>
            <CrewList.Table>
              <CrewList.TableHeader>
                <CrewList.TableColumn>Name</CrewList.TableColumn>
                <CrewList.TableColumn>Role</CrewList.TableColumn>
              </CrewList.TableHeader>
              <CrewList.TableBody>
                <CrewList.TableRow>
                  <CrewList.TableCell>{(item) => item.name}</CrewList.TableCell>
                  <CrewList.TableCell>{(item) => item.role}</CrewList.TableCell>
                </CrewList.TableRow>
              </CrewList.TableBody>
            </CrewList.Table>
          </CrewList.List>
        </Section>

        <Section>
          <Heading level={3}>List with date range filter</Heading>
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
          <Heading level={3}>List with date range filter in the loader</Heading>
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
    </ComponentGroupPage>
  );
}
