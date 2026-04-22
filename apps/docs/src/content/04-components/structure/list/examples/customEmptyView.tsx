import {
  Heading,
  IconDomain,
  IllustratedMessage,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import { type Domain } from "@/content/04-components/structure/list/examples/domainApi";

export default () => {
  const List = typedList<Domain>();

  const emptyView = (
    <IllustratedMessage>
      <IconDomain />
      <Heading>Keine Domains gefunden</Heading>
      <Text>Füge neue Domains hinzu, um zu starten.</Text>
    </IllustratedMessage>
  );

  return (
    <List.List aria-label="Domains" emptyView={emptyView}>
      <List.StaticData data={[]} />
      <List.Item>{() => null}</List.Item>
    </List.List>
  );
};
