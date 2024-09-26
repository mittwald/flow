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
    <DomainList.List batchSize={2}>
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
        defaultSelected={["Verifiziert"]}
      />
      <DomainList.Filter
        property="tld"
        mode="some"
        name="Filter"
        values={[".de Endung", ".com Endung"]}
        matcher={(filterValue, tld) => {
          return (
            filterValue.split(" ")[0].replace(".", "") ===
            tld
          );
        }}
        defaultSelected={[".de Endung"]}
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
