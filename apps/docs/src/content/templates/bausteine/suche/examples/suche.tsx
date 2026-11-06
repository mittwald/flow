import {
  Button,
  Content,
  Flex,
  HeaderNavigation,
  Heading,
  IconSearch,
  IllustratedMessage,
  Link,
  Modal,
  SearchField,
  Text,
  typedList,
  useModalController,
} from "@mittwald/flow-react-components";
import { useState } from "react";
import styles from "./suche.module.css";

interface SearchEntry {
  id: string;
  title: string;
  /** Where the target lives – shown below the title. */
  context: string;
}

/* Sample data – replace with the targets of your application. */
const entries: SearchEntry[] = [
  {
    id: "project",
    title: "Webshop",
    context: "Projekte",
  },
  {
    id: "wordpress",
    title: "WordPress",
    context: "Webshop › Apps",
  },
  {
    id: "domain",
    title: "example.de",
    context: "Webshop › Domains",
  },
  {
    id: "databases",
    title: "Datenbanken",
    context: "Webshop › Datenbanken",
  },
  {
    id: "mailboxes",
    title: "E-Mail-Postfächer",
    context: "Webshop › E-Mail",
  },
  {
    id: "backups",
    title: "Backups",
    context: "Webshop › Backups",
  },
  {
    id: "cronjobs",
    title: "Cronjobs",
    context: "Webshop › Cronjobs",
  },
  {
    id: "ssh",
    title: "SSH-Zugänge",
    context: "Webshop › Zugänge",
  },
  {
    id: "invoices",
    title: "Rechnungen",
    context: "Organisation › Finanzen",
  },
  {
    id: "members",
    title: "Mitglieder",
    context: "Organisation › Mitglieder",
  },
  {
    id: "profile",
    title: "Profil",
    context: "Benutzer",
  },
  {
    id: "2fa",
    title: "Zwei-Faktor-Authentifizierung",
    context: "Benutzer › Sicherheit",
  },
];

/*
 * Suggestions and each batch of results show five entries, so the Modal keeps
 * its height while the user types. More results load via „Mehr anzeigen“.
 */
const batchSize = 5;

/* Suggestions while nothing is typed yet – e.g. recently visited targets. */
const suggestions = entries.slice(0, batchSize);

/*
 * Placeholder search: a case-insensitive substring match over the sample data.
 * Swap in your own search – usually a request to your backend.
 */
const search = (query: string): SearchEntry[] => {
  const term = query.trim().toLowerCase();
  if (term.length === 0) {
    return suggestions;
  }
  return entries.filter((entry) =>
    [entry.title, entry.context].some((value) =>
      value.toLowerCase().includes(term),
    ),
  );
};

const SearchList = typedList<SearchEntry>();

/*
 * Lives inside the Modal, so it mounts on every open: the query starts empty
 * and the suggestions show each time.
 */
const Search = () => {
  const controller = useModalController();
  const [query, setQuery] = useState("");
  const results = search(query);

  return (
    <Flex direction="column" gap="m">
      <SearchField
        autoFocus
        value={query}
        onChange={setQuery}
      />
      {/* Keyed by the query, so every new search starts with one batch again. */}
      <SearchList.List
        key={query.trim()}
        batchSize={batchSize}
        aria-label={
          query.trim() ? "Suchergebnisse" : "Vorschläge"
        }
        getItemId={(entry) => entry.id}
        onAction={() => {
          controller.close();
          /* Hand the target to your router here. */
        }}
        emptyView={
          <IllustratedMessage>
            <IconSearch />
            <Heading>Keine Suchergebnisse</Heading>
            <Text>
              Zu „{query.trim()}“ konnten keine Sucheinträge
              gefunden werden.
            </Text>
          </IllustratedMessage>
        }
      >
        <SearchList.StaticData data={results} />
        <SearchList.Item textValue={(entry) => entry.title}>
          {(entry) => (
            <SearchList.ItemView>
              <Heading>{entry.title}</Heading>
              <Text>{entry.context}</Text>
            </SearchList.ItemView>
          )}
        </SearchList.Item>
      </SearchList.List>
    </Flex>
  );
};

export default () => {
  const controller = useModalController();

  return (
    <>
      <HeaderNavigation aria-label="Hauptnavigation">
        <Link href="#">Dashboard</Link>
        <Link href="#">Organisation</Link>
        <Link href="#" aria-current="page">
          Projekte
        </Link>
        <Button
          variant="plain"
          color="secondary"
          aria-label="Suche"
          onPress={controller.open}
        >
          <IconSearch />
        </Button>
      </HeaderNavigation>
      {/*
       * No visible heading and no close button – the SearchField is the
       * Modal's header. The heading stays for screen readers: it names the
       * dialog.
       */}
      <Modal
        controller={controller}
        size="m"
        showCloseButton={false}
      >
        <Heading className={styles.visuallyHidden}>
          Suche
        </Heading>
        <Content>
          <Search />
        </Content>
      </Modal>
    </>
  );
};
