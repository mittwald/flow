"use client";

import { demoData } from "@/app/remote/list/demoData";
import {
  Avatar,
  BrowserOnly,
  ContextMenu,
  Heading,
  IconEmail,
  List,
  ListItemView,
  MenuItem,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  const DemoList = typedList<(typeof demoData)[number]>();

  return (
    <BrowserOnly>
      <Section>
        <List onAction={console.log} batchSize={10} aria-label="Demo">
          <DemoList.Filter property="language" name="Language">
            {(val) => <>{val}</>}
          </DemoList.Filter>
          <DemoList.Search autoSubmit />
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
          <DemoList.Item textValue={(d) => d.name} showTiles>
            {(d) => (
              <ListItemView>
                <Avatar>
                  <IconEmail />
                </Avatar>
                <Heading>
                  {d.name} ({d.language})
                </Heading>
                <Text>{d.bio.slice(0, 100)}</Text>
                <ContextMenu>
                  <MenuItem>
                    <IconEmail />
                    <Text>Menu item</Text>
                  </MenuItem>
                </ContextMenu>
              </ListItemView>
            )}
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
