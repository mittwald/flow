import {
  Align,
  Button,
  ColumnLayout,
  CopyButton,
  Header,
  Heading,
  InlineCode,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  Option,
  Section,
  Select,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <Section>
    <Header>
      <Heading>WordPress 6.5.3 App</Heading>
      <Button color="secondary" variant="soft">
        PHP Version anpassen
      </Button>
    </Header>
    <ColumnLayout>
      <LabeledValue>
        <Label>Installationsverzeichnis</Label>
        <Text>
          <InlineCode>/f1-blog-th6v8</InlineCode>
        </Text>
        <CopyButton value="/f1-blog-th6v8" />
      </LabeledValue>
      <LabeledValue>
        <Label>PHP-Version</Label>
        <Text>PHP 8.5.3</Text>
      </LabeledValue>
    </ColumnLayout>
  </Section>
  <Section>
    <Header>
      <Heading>Domain</Heading>
      <Button color="secondary" variant="soft">
        Bearbeiten
      </Button>
    </Header>
    <ColumnLayout>
      <LabeledValue>
        <Label>Frontend</Label>
        <Link target="_blank">
          p-xy1z2.project.frontend
        </Link>
      </LabeledValue>
      <LabeledValue>
        <Label>Backend</Label>
        <Link target="_blank">p-xy1z2.project.backend</Link>
      </LabeledValue>
    </ColumnLayout>
  </Section>
  <Section>
    <Heading>SSH-Zugangsdaten</Heading>
    <ColumnLayout l={[2, 1]} m={[2, 1]}>
      <Select defaultSelectedKey="1">
        <Label>SSH-Benutzer</Label>
        <Option value="1">
          mStudio Benutzer (m.muster@mittwald.de)
        </Option>
      </Select>
    </ColumnLayout>
    <Table aria-label="SSH-Zugangsdaten">
      <TableHeader>
        <TableColumn />
        <TableColumn />
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell rowHeader>Benutzername</TableCell>
          <TableCell>
            <Align>
              <Text>j.eimertenbrink</Text>
              <CopyButton value="m.muster" />
            </Align>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowHeader>Hostname</TableCell>
          <TableCell>
            <Align>
              <Text>ssh.mittwald.host</Text>
              <CopyButton value="ssh.mittwald.host" />
            </Align>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowHeader>URL</TableCell>
          <TableCell>
            <Align>
              <Text>j.eimertenbrink@ssh.mittwald.host</Text>
              <CopyButton value="m.muster@ssh.mittwald.host" />
            </Align>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Section>
</LayoutCard>;
