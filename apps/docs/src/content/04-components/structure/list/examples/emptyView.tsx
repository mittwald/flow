import { typedList } from "@mittwald/flow-react-components";
import { type Domain } from "@/content/04-components/structure/list/examples/domainApi";

export default () => {
  const List = typedList<Domain>();

  return (
    <List.List aria-label="Domains">
      <List.StaticData data={[]} />
      <List.Item>{() => null}</List.Item>
    </List.List>
  );
};
