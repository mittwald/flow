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
import { domains } from "@/content/03-components/structure/list/examples/domainApi";
import type { Domain } from "@/content/03-components/structure/list/examples/domainApi";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List batchSize={3}>
      <DomainList.StaticData data={domains} />
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
