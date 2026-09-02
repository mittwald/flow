import {
  Avatar,
  ContextMenu,
  Heading,
  IconDelete,
  IconDomain,
  IconEdit,
  IconInfo,
  IconSubdomain,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/components/list/list-item/examples/domainApi";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List
      batchSize={2}
      hidePagination
      aria-label="Domains"
      getItemId={(domain) => domain.id}
    >
      <DomainList.StaticData data={domains} />
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
            <Heading>{domain.hostname}</Heading>
            <Text>{domain.type}</Text>

            <ContextMenu>
              <MenuItem>
                <IconInfo />
                <Text>Details anzeigen</Text>
              </MenuItem>
              <MenuItem>
                <IconEdit />
                <Text>Bearbeiten</Text>
              </MenuItem>
              <MenuItem>
                <IconDelete />
                <Text>Löschen</Text>
              </MenuItem>
            </ContextMenu>
          </DomainList.ItemView>
        )}
      </DomainList.Item>
    </DomainList.List>
  );
};
