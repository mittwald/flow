import {
  Avatar,
  Checkbox,
  Heading,
  IconDomain,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";

export default () => {
  const List = typedList<Domain>();

  return (
    <List.List batchSize={4} aria-label="Domains">
      <List.StaticData data={domains} />
      <List.Item showTiles>
        {(domain) => (
          <List.ItemView>
            <Checkbox
              aria-label={`${domain.hostname} auswählen`}
            />
            <Avatar>
              <IconDomain />
            </Avatar>
            <Heading>{domain.hostname}</Heading>
            <Text>{domain.type}</Text>
          </List.ItemView>
        )}
      </List.Item>

      <List.Table>
        <List.TableHeader>
          <List.TableColumn>
            <Checkbox aria-label="Alle auswählen" />
          </List.TableColumn>
          <List.TableColumn>Domain</List.TableColumn>
        </List.TableHeader>
        <List.TableBody>
          <List.TableRow>
            <List.TableCell>
              {(domain) => (
                <Checkbox
                  aria-label={`${domain.hostname} auswählen`}
                />
              )}
            </List.TableCell>
            <List.TableCell>
              {(domain) => domain.hostname}
            </List.TableCell>
          </List.TableRow>
        </List.TableBody>
      </List.Table>
    </List.List>
  );
};
