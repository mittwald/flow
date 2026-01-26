import {
  ActionGroup,
  AlertBadge,
  Avatar,
  Button,
  ContextMenu,
  Heading,
  IconDomain,
  IconDownload,
  IconSubdomain,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/04-components/structure/list/examples/domainApi";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List
      batchSize={2}
      aria-label="Domains"
      getItemId={(domain) => domain.id}
    >
      <DomainList.StaticData data={domains} />
      <ActionGroup>
        <Button
          color="secondary"
          variant="soft"
          slot="secondary"
        >
          <IconDownload />
        </Button>
        <Button color="accent">Anlegen</Button>
      </ActionGroup>
      <DomainList.Search />
      <DomainList.Filter
        property="type"
        mode="some"
        name="Type"
      />
      <DomainList.Sorting
        property="hostname"
        name="Domain A bis Z"
        direction="asc"
      />
      <DomainList.Sorting
        property="hostname"
        name="Domain Z bis A"
        direction="desc"
      />
      <DomainList.Sorting
        property="type"
        name="Type A bis Z"
        direction="asc"
      />
      <DomainList.Sorting
        property="type"
        name="Type Z bis A"
        direction="desc"
      />
      <DomainList.Table>
        <DomainList.TableHeader>
          <DomainList.TableColumn>
            Name
          </DomainList.TableColumn>
          <DomainList.TableColumn>
            Type
          </DomainList.TableColumn>
          <DomainList.TableColumn>
            TLD
          </DomainList.TableColumn>
          <DomainList.TableColumn>
            Hostname
          </DomainList.TableColumn>
        </DomainList.TableHeader>

        <DomainList.TableBody>
          <DomainList.TableRow>
            <DomainList.TableCell>
              {(domain) => domain.domain}
            </DomainList.TableCell>
            <DomainList.TableCell>
              {(domain) => domain.type}
            </DomainList.TableCell>
            <DomainList.TableCell>
              {(domain) => domain.tld}
            </DomainList.TableCell>
            <DomainList.TableCell>
              {(domain) => domain.hostname}
            </DomainList.TableCell>
          </DomainList.TableRow>
        </DomainList.TableBody>
      </DomainList.Table>
      <DomainList.Item
        textValue={(domain) => domain.domain}
      >
        {(domain) => (
          <DomainList.ItemView>
            <Avatar
              color={
                domain.type === "Domain" ? "blue" : "teal"
              }
            >
              {domain.type === "Domain" ? (
                <IconDomain />
              ) : (
                <IconSubdomain />
              )}
            </Avatar>
            <Heading>
              {domain.hostname}
              {!domain.verified && (
                <AlertBadge status="warning">
                  Unverifiziert
                </AlertBadge>
              )}
            </Heading>
            <Text>{domain.type}</Text>

            <ContextMenu>
              <MenuItem>Details anzeigen</MenuItem>
              <MenuItem>Löschen</MenuItem>
            </ContextMenu>
          </DomainList.ItemView>
        )}
      </DomainList.Item>
    </DomainList.List>
  );
};
