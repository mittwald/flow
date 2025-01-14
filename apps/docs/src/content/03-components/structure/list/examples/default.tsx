import { typedList } from "@mittwald/flow-react-components/List";
import {
  type Domain,
  domains,
} from "~/content/03-components/structure/list/examples/domainApi";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ContextMenu from "@mittwald/flow-react-components/ContextMenu";
import {
  IconDomain,
  IconDownload,
  IconSubdomain,
} from "@mittwald/flow-react-components/Icons";
import AlertBadge from "@mittwald/flow-react-components/AlertBadge";
import MenuItem from "@mittwald/flow-react-components/MenuItem";
import Button from "@mittwald/flow-react-components/Button";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List batchSize={5}>
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
