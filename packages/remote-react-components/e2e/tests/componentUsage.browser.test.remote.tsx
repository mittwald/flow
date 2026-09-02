import {
  Button,
  Content,
  CountryOptions,
  Heading,
  Modal,
  ModalTrigger,
  Section,
  Select,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Text,
  List,
  typedList,
} from "@mittwald/flow-remote-react-components";
import { use, type FC } from "react";

export const modal = () => (
  <Section>
    <Heading>Death Star</Heading>
    <ModalTrigger>
      <Button>Battle station controls</Button>
      <Modal>
        <Content>
          <Text>Command the systems.</Text>
        </Content>
      </Modal>
    </ModalTrigger>
  </Section>
);

export const table = () => (
  <Table aria-label="Weapons">
    <TableHeader>
      <TableColumn>Weapon</TableColumn>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Superlaser</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const list = () => {
  const EmptyList = typedList<{ id: string }>();

  return (
    <List aria-label="Fleet">
      <EmptyList.StaticData data={[]} />
      <EmptyList.Search autoSubmit />
      <EmptyList.Item>{(item) => <Text>{item.id}</Text>}</EmptyList.Item>
    </List>
  );
};

const slowResource = new Promise<string>((resolve) =>
  setTimeout(() => resolve("Ready"), 300),
);

const Suspending: FC = () => <Text>{use(slowResource)}</Text>;

export const suspending = () => (
  <Section>
    <Suspending />
  </Section>
);

export const viewComposition = () => (
  <Select label="Country">
    <CountryOptions />
  </Select>
);
