import {
  Avatar,
  Content,
  ContextMenu,
  Heading,
  IconEmail,
  Label,
  MenuItem,
  ProgressBar,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const List = typedList<{ mail: string }>();

  return (
    <List.List
      batchSize={2}
      aria-label="E-Mail-Adressen"
      hidePagination
    >
      <List.StaticData
        data={[
          { mail: "john@doe.com" },
          { mail: "max@mustermann.de" },
        ]}
      />
      <List.Item textValue={(mail) => mail.mail}>
        {(mail) => (
          <List.ItemView l={[3, 1]} m={[2, 1]} s={[1]}>
            <Avatar>
              <IconEmail />
            </Avatar>
            <Heading>{mail.mail}</Heading>

            <Content>
              <ProgressBar size="s" value={50}>
                <Label>Speicherplatz</Label>
              </ProgressBar>
            </Content>

            <ContextMenu>
              <MenuItem>Details anzeigen</MenuItem>
            </ContextMenu>
          </List.ItemView>
        )}
      </List.Item>
    </List.List>
  );
};
