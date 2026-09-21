import {
  Avatar,
  Button,
  Combine,
  ContextualHelp,
  ContextualHelpTrigger,
  Heading,
  IconDomain,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/components/list/list-item-view/examples/domainApi";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List
      batchSize={3}
      hidePagination
      aria-label="Domains"
      getItemId={(domain) => domain.id}
    >
      <DomainList.StaticData
        data={domains.filter(
          (domain) => domain.type === "Domain",
        )}
      />
      <DomainList.Item
        textValue={(domain) => domain.domain}
      >
        {(domain) => (
          <DomainList.ItemView>
            <Avatar color="blue">
              <IconDomain />
            </Avatar>
            <Heading>{domain.hostname}</Heading>
            <Text>{domain.type}</Text>
            {!domain.verified && (
              <Text>
                <Combine>
                  <Text>Nicht verifiziert</Text>
                  <ContextualHelpTrigger subject="Verifizierung">
                    <Button />
                    <ContextualHelp>
                      <Text>
                        Hinterlege den TXT-Record bei deinem
                        Registrar, damit wir die Domain
                        verifizieren können.
                      </Text>
                    </ContextualHelp>
                  </ContextualHelpTrigger>
                </Combine>
              </Text>
            )}
            <Text>.{domain.tld}</Text>
          </DomainList.ItemView>
        )}
      </DomainList.Item>
    </DomainList.List>
  );
};
