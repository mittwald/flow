import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";
import {
  AlertBadge,
  Avatar,
  ContextMenu,
  Heading,
  IconDomain,
  IconSubdomain,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List
      batchSize={5}
      aria-label="Domains"
      getItemId={(domain) => domain.id}
    >
      <DomainList.StaticData data={domains} />
      <DomainList.Sorting
        property="hostname"
        name="Name A bis Z"
        direction="asc"
      />
      <DomainList.Sorting
        property="hostname"
        name="Name Z bis A"
        direction="desc"
        defaultEnabled
      />
      <DomainList.Sorting
        property="tld"
        name="TLD A bis Z"
        direction="asc"
      />
      <DomainList.Sorting
        property="tld"
        name="TLD Z bis A"
        direction="desc"
      />
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
