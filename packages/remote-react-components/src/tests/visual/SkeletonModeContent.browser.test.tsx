import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import gopher from "@/tests/assets/gopher.webp";
import { skeletonModeSince } from "@/tests/lib/skeletonModeSince";
import { SkeletonComparison } from "@/tests/lib/SkeletonComparison";

const nginxConfig = `server {
  listen 443 ssl;
  server_name webshop.example-domain.de;
  root /html/webshop/public;
}`;

const markdown = [
  "## Domain umziehen",
  "Stelle vor dem Umzug den **Nameserver** auf mittwald um.",
  "- Zone exportieren\n- Zone importieren\n  - Einträge prüfen",
  "> Die Umstellung dauert bis zu 24 Stunden.",
  "```\ndig webshop.example-domain.de\n```",
  "| Eintrag | Wert |\n| --- | --- |\n| A | 192.0.2.10 |",
].join("\n\n");

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode content (%s)",
  async ({ testScreenshot, render, components }) => {
    const {
      Section,
      Flex,
      Text,
      Heading,
      Kbd,
      AvatarStack,
      Avatar,
      Initials,
      FileCard,
      FileCardList,
      FileDropZone,
      FileField,
      Button,
      IconUpload,
    } = components;

    await render(
      <SkeletonComparison components={components}>
        <Section>
          <Flex gap="m" align="center">
            <Text>Kopieren mit</Text>
            <Kbd keys={["mod", "c"]} variant="soft" />
            <Kbd>Esc</Kbd>
            <AvatarStack totalCount={6} onCountPress={() => undefined}>
              <Avatar>
                <Initials>Max Mustermann</Initials>
              </Avatar>
              <Avatar>
                <Initials>Erika Musterfrau</Initials>
              </Avatar>
              <Avatar>
                <Initials>Jonas Beispiel</Initials>
              </Avatar>
            </AvatarStack>
          </Flex>
          <FileDropZone>
            <IconUpload />
            <Heading>Backup hochladen</Heading>
            <Text>Ziehe die Datei hierher.</Text>
            <FileField name="backup">
              <Button>Datei auswählen</Button>
            </FileField>
          </FileDropZone>
          <FileCardList>
            <FileCard
              name="rechnung-2026-09.pdf"
              type="application/pdf"
              sizeInBytes={123456}
              href="#"
              onDelete={() => undefined}
            />
            <FileCard
              name="logo.webp"
              type="image/webp"
              imageSrc={gopher}
              sizeInBytes={45678}
            />
          </FileCardList>
        </Section>
      </SkeletonComparison>,
    );

    await testScreenshot("SkeletonMode content");
  },
);

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode code and markdown (%s)",
  async ({ testScreenshot, render, components }) => {
    const { Section, CodeBlock, Markdown } = components;

    await render(
      <SkeletonComparison components={components}>
        <Section>
          <CodeBlock code={nginxConfig} />
          <CodeBlock>ssh p-4711@ssh.example-domain.de</CodeBlock>
          <Markdown>{markdown}</Markdown>
        </Section>
      </SkeletonComparison>,
    );

    await testScreenshot("SkeletonMode code and markdown");
  },
);

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode chat (%s)",
  async ({ testScreenshot, render, components }) => {
    const {
      Text,
      Avatar,
      Initials,
      Chat,
      MessageThread,
      Message,
      Header,
      Content,
    } = components;

    await render(
      <SkeletonComparison components={components}>
        <Chat height={220}>
          <MessageThread>
            <Message>
              <Header>
                <Avatar>
                  <Initials>Max Mustermann</Initials>
                </Avatar>
                <Text>Max Mustermann</Text>
              </Header>
              <Content>
                <Text>Das Zertifikat für den Webshop wurde verlängert.</Text>
              </Content>
            </Message>
            <Message type="sender">
              <Header>
                <Text>Support</Text>
              </Header>
              <Content>
                <Text>Danke, der Webshop ist wieder erreichbar.</Text>
              </Content>
            </Message>
          </MessageThread>
        </Chat>
      </SkeletonComparison>,
    );

    await testScreenshot("SkeletonMode chat");
  },
);

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode charts and editors (%s)",
  async ({ testScreenshot, render, components }) => {
    const {
      Section,
      ColumnLayout,
      CartesianChart,
      Bar,
      XAxis,
      YAxis,
      DonutChart,
      CodeEditor,
      MarkdownEditor,
      Label,
      FieldDescription,
    } = components;

    await render(
      <SkeletonComparison components={components}>
        <Section>
          <ColumnLayout m={[2, 1]}>
            <CartesianChart
              height="180px"
              data={[
                { month: "Juli", requests: 1200 },
                { month: "August", requests: 1800 },
              ]}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="requests" />
            </CartesianChart>
            <DonutChart
              value={70}
              segments={[
                { title: "Datenbanken", value: 45 },
                { title: "Dateien", value: 25 },
              ]}
              legendPosition="bottom"
            />
          </ColumnLayout>
          <CodeEditor value={nginxConfig}>
            <Label>Konfiguration</Label>
            <FieldDescription>Wird beim Speichern geprüft.</FieldDescription>
          </CodeEditor>
          <MarkdownEditor value="**Wartung** am Montag" rows={3}>
            <Label>Hinweis für das Team</Label>
          </MarkdownEditor>
        </Section>
      </SkeletonComparison>,
    );

    await testScreenshot("SkeletonMode charts and editors");
  },
);

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode cropper and calendar (%s)",
  async ({ testScreenshot, render, components }) => {
    const { Flex, ImageCropper, RangeCalendar } = components;

    await render(
      <SkeletonComparison components={components}>
        <Flex gap="xl" align="start">
          <ImageCropper image={gopher} width={240} height={160} />
          <RangeCalendar aria-label="Zeitraum" />
        </Flex>
      </SkeletonComparison>,
    );

    await testScreenshot("SkeletonMode cropper and calendar");
  },
);

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode lists and tables (%s)",
  async ({ testScreenshot, render, components }) => {
    const {
      Section,
      Heading,
      Text,
      Avatar,
      Initials,
      AlertBadge,
      Table,
      TableHeader,
      TableColumn,
      TableBody,
      TableRow,
      TableCell,
      typedList,
    } = components;

    const DomainList = typedList<{ hostname: string; type: string }>();

    await render(
      <SkeletonComparison components={components}>
        <Section>
          <DomainList.List aria-label="Domains">
            <DomainList.StaticData
              data={[
                { hostname: "webshop.example-domain.de", type: "Domain" },
                { hostname: "blog.example-domain.de", type: "Subdomain" },
              ]}
            />
            <DomainList.Item textValue={(domain) => domain.hostname}>
              {(domain) => (
                <DomainList.ItemView>
                  <Avatar>
                    <Initials>{domain.hostname}</Initials>
                  </Avatar>
                  <Heading>
                    {domain.hostname}
                    <AlertBadge status="warning">Unverifiziert</AlertBadge>
                  </Heading>
                  <Text>{domain.type}</Text>
                </DomainList.ItemView>
              )}
            </DomainList.Item>
          </DomainList.List>
          <Table aria-label="Zertifikate">
            <TableHeader>
              <TableColumn>Domain</TableColumn>
              <TableColumn>Gültig bis</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>webshop.example-domain.de</TableCell>
                <TableCell>12.01.2027</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>blog.example-domain.de</TableCell>
                <TableCell>
                  <Text>03.03.2027</Text>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>
      </SkeletonComparison>,
    );

    await testScreenshot("SkeletonMode lists and tables");
  },
);

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode modal (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      SkeletonMode,
      Modal,
      Heading,
      Content,
      Text,
      ActionGroup,
      Button,
    },
  }) => {
    await render(
      <SkeletonMode>
        <Modal isDefaultOpen showCloseButton>
          <Heading>Domain umziehen</Heading>
          <Content>
            <Text>
              Die Domain webshop.example-domain.de wird in das Projekt „Webshop
              Relaunch“ umgezogen.
            </Text>
          </Content>
          <ActionGroup>
            <Button color="secondary" variant="soft">
              Abbrechen
            </Button>
            <Button>Umziehen</Button>
          </ActionGroup>
        </Modal>
      </SkeletonMode>,
    );

    await expect.element(page.getByRole("dialog")).toBeVisible();
    await testScreenshot("SkeletonMode modal");
  },
);
