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
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List batchSize={5} aria-label="Domains">
      <DomainList.StaticData data={domains} />
      <DomainList.Filter
        property="type"
        mode="some"
        name="Type"
        values={["Domain", "Subdomain"]}
        defaultSelected={["Domain"]}
      />
      <DomainList.Filter
        property="verified"
        mode="some"
        name="Verifizierung"
        matcher={(filterValue, propertyValue) =>
          filterValue === "Verifiziert"
            ? propertyValue
            : !propertyValue
        }
        defaultSelected={["Unverifiziert"]}
        values={["Verifiziert", "Unverifiziert"]}
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
