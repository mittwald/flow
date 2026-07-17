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

export default function Page() {
  const DemoList = typedList<(typeof demoData)[number]>();

  return (
    <BrowserOnly>
      <Section>
        <List onAction={console.log} batchSize={10} aria-label="Demo">
          <DemoList.Filter property="faction" name="Faction">
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
