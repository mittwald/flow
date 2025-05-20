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
    <DomainList.List batchSize={2} aria-label="Domains">
      <DomainList.StaticData data={domains} />
      <DomainList.Filter
        property="verified"
        mode="some"
        name="Status"
        values={["Verifiziert", "Unverifiziert"]}
        matcher={(filterValue, verified) => {
          return filterValue === "Verifiziert"
            ? verified
            : !verified;
        }}
      />
      <DomainList.Filter
        property="id"
        mode="some"
        name="Filter"
        values={[
          "SSL Zertifikat abgelaufen",
          "Kein Ziel hinterlegt",
        ]}
        matcher={() => true}
      />
      <DomainList.Item>
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
