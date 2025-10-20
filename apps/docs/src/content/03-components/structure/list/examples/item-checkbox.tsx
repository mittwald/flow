import {
  Avatar,
  Checkbox,
  Heading,
  IconDomain,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";
import { useState } from "react";

export default () => {
  const List = typedList<Domain>();

  const [selectedDomains, setSelectedDomains] = useState<
    Domain[]
  >([]);

  const onSelected = (
    domain: Domain,
    selected: boolean,
  ) => {
    if (selected) {
      setSelectedDomains((prev) => [...prev, domain]);
    } else {
      setSelectedDomains((prev) =>
        prev.filter((d) => d.id !== domain.id),
      );
    }
  };

  const isSelected = (domain: Domain) => {
    return (
      selectedDomains.find((d) => d.id === domain.id) !==
      undefined
    );
  };

  return (
    <List.List
      hidePagination
      batchSize={2}
      aria-label="Domains"
      onAction={(domain) => {
        onSelected(domain, !isSelected(domain));
      }}
    >
      <List.StaticData data={domains} />
      <List.Item
        showTiles
        textValue={(domain) => domain.hostname}
      >
        {(domain) => (
          <List.ItemView>
            <Checkbox
              isSelected={isSelected(domain)}
              onChange={(value) =>
                onSelected(domain, value)
              }
              aria-label={`${domain.hostname} auswählen`}
            />
            <Avatar>
              <IconDomain />
            </Avatar>
            <Heading>{domain.hostname}</Heading>
            <Text>{domain.type}</Text>
          </List.ItemView>
        )}
      </List.Item>

      <List.Table>
        <List.TableHeader>
          <List.TableColumn>
            <Checkbox
              aria-label="Alle auswählen"
              onChange={(v) =>
                setSelectedDomains(v ? domains : [])
              }
            />
          </List.TableColumn>
          <List.TableColumn>Domain</List.TableColumn>
        </List.TableHeader>
        <List.TableBody>
          <List.TableRow>
            <List.TableCell>
              {(domain) => (
                <Checkbox
                  isSelected={isSelected(domain)}
                  onChange={(value) =>
                    onSelected(domain, value)
                  }
                  aria-label={`${domain.hostname} auswählen`}
                />
              )}
            </List.TableCell>
            <List.TableCell>
              {(domain) => domain.hostname}
            </List.TableCell>
          </List.TableRow>
        </List.TableBody>
      </List.Table>
    </List.List>
  );
};
