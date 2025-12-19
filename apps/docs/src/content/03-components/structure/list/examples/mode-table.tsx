import { typedList } from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List
      batchSize={4}
      defaultViewMode="table"
      aria-label="Domains"
      hidePagination
      getItemId={(domain) => domain.id}
    >
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
    </DomainList.List>
  );
};
