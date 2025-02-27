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
  type SortingFn,
  SortingFunctions,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  type DomainWithBigIntId = Omit<Domain, "id"> & {
    id: bigint;
    createdAt: Date;
  };

  const domainsWithDateTime = domains.map(
    (domain, index) => {
      const daysAgo =
        index * 3 + Math.floor(Math.random() * 5);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const bigIntId = BigInt(1000000000000 + index);

      return {
        ...domain,
        id: bigIntId,
        createdAt: createdAt,
      };
    },
  );

  const DomainList = typedList<DomainWithBigIntId>();

  const bigIntSorting =
    SortingFunctions.bigInt as SortingFn<DomainWithBigIntId>;
  const dateTimeSorting =
    SortingFunctions.dateTime as SortingFn<DomainWithBigIntId>;

  return (
    <DomainList.List batchSize={5}>
      <DomainList.StaticData data={domainsWithDateTime} />

      <DomainList.Sorting
        property="hostname"
        name="Name A bis Z"
        direction="asc"
      />
      <DomainList.Sorting
        property="hostname"
        name="Name Z bis A"
        direction="desc"
      />

      <DomainList.Sorting
        property="id"
        name="ID (aufsteigend)"
        direction="asc"
        customSortingFn={bigIntSorting}
      />
      <DomainList.Sorting
        property="id"
        name="ID (absteigend)"
        direction="desc"
        customSortingFn={bigIntSorting}
        defaultEnabled
      />

      <DomainList.Sorting
        property="createdAt"
        name="Erstellt am (älteste zuerst)"
        direction="asc"
        customSortingFn={dateTimeSorting}
      />
      <DomainList.Sorting
        property="createdAt"
        name="Erstellt am (neueste zuerst)"
        direction="desc"
        customSortingFn={dateTimeSorting}
      />

      <DomainList.Sorting
        property="tld"
        name="TLD-Länge (kürzeste zuerst)"
        direction="asc"
        customSortingFn={(rowA, rowB, columnId: string) => {
          const tldA = String(
            rowA.getValue(columnId) || "",
          );
          const tldB = String(
            rowB.getValue(columnId) || "",
          );
          return tldA.length - tldB.length;
        }}
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
            <Text>ID: {domain.id}</Text>
            <Text>TLD: {domain.tld}</Text>
            <Text>
              Erstellt am:{" "}
              {new Date(domain.createdAt).toLocaleString()}
            </Text>

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
