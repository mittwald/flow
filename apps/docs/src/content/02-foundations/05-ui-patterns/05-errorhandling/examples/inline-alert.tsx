import {
  AlertText,
  Avatar,
  Content,
  Flex,
  Heading,
  IconDomain,
  LayoutCard,
  ListItemView,
  SkeletonText,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import { Suspense } from "react";

export default () => {
  const DomainList = typedList<{
    id: string;
    domain: string;

    target?: string;
  }>();

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="light">
        Domains
      </Heading>
      <LayoutCard>
        <DomainList.List
          getItemId={(domain) => domain.id}
          loadingItemsCount={3}
        >
          <DomainList.StaticData
            data={[
              {
                id: "1",
                domain: "mjaofd6.project.space",
              },
              {
                id: "2",
                domain: "formel1.de",
                target: "Mein WordPress",
              },
              {
                id: "3",
                domain: "schumi-fanclub.de",
                target: "/home/xyz/ordner/tollerpfad",
              },
            ]}
          />
          <DomainList.Search />
          <DomainList.Item>
            {(domain) => (
              <ListItemView>
                <Avatar>
                  <IconDomain />
                </Avatar>
                <Heading>{domain.domain}</Heading>
                <Text>
                  {domain.target ? (
                    domain.target
                  ) : (
                    <Suspense fallback={<SkeletonText />}>
                      <AlertText status="danger">
                        Fehler beim Laden
                      </AlertText>
                    </Suspense>
                  )}
                </Text>

                <Content>
                  <small></small>
                </Content>
              </ListItemView>
            )}
          </DomainList.Item>
        </DomainList.List>
      </LayoutCard>
    </Flex>
  );
};
