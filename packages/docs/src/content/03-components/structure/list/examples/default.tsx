import { typedList } from "@mittwald/flow-react-components/List";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ContextMenu from "@mittwald/flow-react-components/ContextMenu";
import {
  IconDomain,
  IconSubdomain,
} from "@mittwald/flow-react-components/Icons";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";
import MenuItem from "@mittwald/flow-react-components/MenuItem";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List batchSize={5}>
      <DomainList.StaticData data={domains} />
      <DomainList.Search />
      <DomainList.Filter
        property="type"
        mode="some"
        name="Type"
      />
      <DomainList.Sorting property="domain" name="Domain" />
      <DomainList.Sorting property="type" name="Type" />
      <DomainList.Item>
        {(domain) => (
          <DomainList.ItemView>
            <Avatar
              variant={domain.type === "Domain" ? 1 : 2}
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
                <StatusBadge status="warning">
                  Unverifiziert
                </StatusBadge>
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
