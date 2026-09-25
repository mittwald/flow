"use client";

import { demoData } from "@/app/remote/list/demoData";
import {
  Action,
  ActionGroup,
  Avatar,
  BrowserOnly,
  Button,
  Content,
  ContextMenu,
  Heading,
  IconEmail,
  List,
  ListItemView,
  MenuItem,
  Modal,
  Section,
  Text,
  typedList,
  useModalController,
} from "@mittwald/flow-remote-react-components";

/**
 * The list demo, and the counterpart of `src/app/remote-vue/_demos/list.tsx`.
 *
 * The two pages describe the same list — an async loader that takes its time,
 * two filters, a search, two sortings, tiles, a table view, and a context menu
 * per item that opens that item's own modal. Keeping them the same is what
 * makes the React/Vue switch above them worth anything.
 */
export default function Page() {
  const DemoList = typedList<(typeof demoData)[number]>();

  return (
    <BrowserOnly>
      <Section>
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
              all-filters modal, which is what puts that modal on desktop. */}
          <DemoList.Filter
            property="homeworld"
            name="Homeworld"
            mode="some"
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
                        <Heading>{d.faction}</Heading>
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
    </BrowserOnly>
  );
}
