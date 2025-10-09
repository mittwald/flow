import {
  Avatar,
  Content,
  Flex,
  Heading,
  IconExtension,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const List = typedList<{ text: string }>();

  return (
    <List.List
      defaultViewMode="tiles"
      aria-label="Extensions"
    >
      <List.StaticData
        data={[
          { text: "Meine Extension" },
          {
            text: "Meine andere Extension mit einen deutlich längeren Namen",
          },
        ]}
      />
      <List.Item
        showTiles
        showList={false}
        textValue={(i) => i.text}
      >
        {(i) => (
          <List.ItemView>
            <Avatar>
              <IconExtension />
            </Avatar>
            <Heading>{i.text}</Heading>

            <Content>
              <Flex justify="end" align="end" grow>
                <Text>Kostenlos</Text>
              </Flex>
            </Content>
          </List.ItemView>
        )}
      </List.Item>
    </List.List>
  );
};
