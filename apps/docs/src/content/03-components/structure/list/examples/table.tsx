import { typedList } from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";
import { Avatar } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { ContextMenu } from "@mittwald/flow-react-components";
import {
  IconDomain,
  IconSubdomain,
} from "@mittwald/flow-react-components";
import { AlertBadge } from "@mittwald/flow-react-components";
import { MenuItem } from "@mittwald/flow-react-components";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List batchSize={5} defaultViewMode="table">
      <DomainList.StaticData data={domains} />
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
