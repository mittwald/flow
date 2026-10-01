import {
  Button,
  Content,
  Flex,
  HeaderNavigation,
  Heading,
  IconSearch,
  Link,
  Modal,
  ModalTrigger,
  SearchField,
  Text,
  useModalController,
} from "@mittwald/flow-react-components";
import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";
import styles from "./suche.module.css";

export default () => (
  <HeaderNavigation aria-label="Hauptnavigation">
    <Link href="#">Dashboard</Link>
    <Link href="#">Organisation</Link>
    <Link href="#" aria-current="page">
      Projekte
    </Link>
    <ModalTrigger>
      <Button
        variant="plain"
        color="secondary"
        aria-label="Suche"
      >
        <IconSearch />
      </Button>
      <Modal size="m">
        <Heading>Suche</Heading>
        <Content>
          <Search />
        </Content>
      </Modal>
    </ModalTrigger>
  </HeaderNavigation>
);

interface SearchEntry {
  id: string;
  title: string;
  /**
   * Where the target lives – rendered as a breadcrumb below
   * the title.
   */
  context: string[];
  description: string;
}

/* Sample data – replace with the targets of your application. */
const entries: SearchEntry[] = [
  {
    id: "project",
    title: "Webshop",
    context: ["Projekte"],
    description:
      "Projekt mit Online-Shop, Domains und E-Mail-Postfächern.",
  },
  {
    id: "wordpress",
    title: "WordPress",
    context: ["Webshop", "Apps"],
    description:
      "WordPress-Installation des Webshops mit PHP 8.3.",
  },
  {
    id: "domain",
    title: "example.de",
    context: ["Webshop", "Domains"],
    description:
      "Domain mit SSL-Zertifikat, verbunden mit der WordPress-Installation.",
  },
  {
    id: "databases",
    title: "Datenbanken",
    context: ["Webshop", "Datenbanken"],
    description:
      "MySQL-Datenbanken des Projekts anlegen, verwalten und sichern.",
  },
  {
    id: "mailboxes",
    title: "E-Mail-Postfächer",
    context: ["Webshop", "E-Mail"],
    description:
      "Postfächer und Weiterleitungen für die Domains des Projekts.",
  },
  {
    id: "backups",
    title: "Backups",
    context: ["Webshop", "Backups"],
    description:
      "Automatische und manuelle Backups des Projekts wiederherstellen.",
  },
  {
    id: "cronjobs",
    title: "Cronjobs",
    context: ["Webshop", "Cronjobs"],
    description:
      "Zeitgesteuerte Aufgaben, die regelmäßig Skripte oder URLs ausführen.",
  },
  {
    id: "ssh",
    title: "SSH-Zugänge",
    context: ["Webshop", "Zugänge"],
    description:
      "SSH- und SFTP-Benutzer mit Zugriff auf die Dateien des Projekts.",
  },
  {
    id: "invoices",
    title: "Rechnungen",
    context: ["Organisation", "Finanzen"],
    description:
      "Rechnungen der Organisation einsehen und als PDF herunterladen.",
  },
  {
    id: "members",
    title: "Mitglieder",
    context: ["Organisation", "Mitglieder"],
    description:
      "Mitglieder einladen und ihre Rollen in der Organisation verwalten.",
  },
  {
    id: "profile",
    title: "Profil",
    context: ["Benutzer"],
    description:
      "Name, E-Mail-Adresse und Profilbild deines Kontos.",
  },
  {
    id: "2fa",
    title: "Zwei-Faktor-Authentifizierung",
    context: ["Benutzer", "Sicherheit"],
    description:
      "Schütze dein Konto mit einem zweiten Faktor zusätzlich zum Passwort.",
  },
];

const resultLimit = 20;

/*
 * Placeholder search: a case-insensitive substring match over the sample data.
 * Swap in your own search – usually a request to your backend.
 */
const search = (query: string): SearchEntry[] => {
  const term = query.trim().toLowerCase();
  if (term.length === 0) {
    return [];
  }
  return entries
    .filter((entry) =>
      [
        entry.title,
        ...entry.context,
        entry.description,
      ].some((value) => value.toLowerCase().includes(term)),
    )
    .slice(0, resultLimit);
};

/* Placeholder navigation: hand the target to your router here. */
const navigate = (entry: SearchEntry): void => {
  console.log(`Navigate to ${entry.id}`);
};

/** Marks every occurrence of the query in `text`. */
const Highlight = ({
  text,
  query,
}: {
  text: string;
  query: string;
}) => {
  const term = query.trim().toLowerCase();
  if (term.length === 0) {
    return text;
  }
  const parts: ReactNode[] = [];
  const lowerText = text.toLowerCase();
  let start = 0;
  let match = lowerText.indexOf(term);
  while (match !== -1) {
    parts.push(text.slice(start, match));
    parts.push(
      <mark key={match} className={styles.mark}>
        {text.slice(match, match + term.length)}
      </mark>,
    );
    start = match + term.length;
    match = lowerText.indexOf(term, start);
  }
  parts.push(text.slice(start));
  return parts;
};

/*
 * Lives inside the Modal, so it mounts on every open: the query and the active
 * result start fresh each time.
 */
const Search = () => {
  const controller = useModalController();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listId = useId();
  const optionId = (index: number) => `${listId}-${index}`;

  const results = search(query);
  const hasQuery = query.trim().length > 0;

  const activate = (index: number) => {
    setActiveIndex(index);
    optionRefs.current[index]?.scrollIntoView({
      block: "nearest",
    });
  };

  const open = (entry: SearchEntry) => {
    controller.close();
    navigate(entry);
  };

  /*
   * Focus stays in the SearchField while the arrow keys move the active
   * result. `aria-activedescendant` tells screen readers which one that is –
   * so users can keep typing and navigate without leaving the input.
   */
  const onKeyDown = (event: KeyboardEvent) => {
    if (results.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      activate(
        Math.min(activeIndex + 1, results.length - 1),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activate(Math.max(activeIndex - 1, 0));
    } else if (event.key === "Enter") {
      const entry = results[activeIndex];
      if (entry) {
        event.preventDefault();
        open(entry);
      }
    }
  };

  return (
    <Flex
      direction="column"
      gap="m"
      onKeyDownCapture={onKeyDown}
    >
      <SearchField
        autoFocus
        value={query}
        onChange={(value) => {
          setQuery(value);
          setActiveIndex(0);
        }}
        aria-controls={listId}
        aria-activedescendant={
          results[activeIndex]
            ? optionId(activeIndex)
            : undefined
        }
      />

      {hasQuery && results.length === 0 && (
        <Text>Keine Ergebnisse für „{query.trim()}“.</Text>
      )}

      <ul
        id={listId}
        role="listbox"
        aria-label="Suchergebnisse"
        className={styles.results}
        hidden={results.length === 0}
      >
        {results.map((entry, index) => (
          <li
            key={entry.id}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            className={styles.result}
            onMouseMove={() => setActiveIndex(index)}
            onClick={() => open(entry)}
          >
            <Text className={styles.title}>
              <Highlight text={entry.title} query={query} />
            </Text>
            <Text className={styles.context}>
              {entry.context.join(" › ")}
            </Text>
            <Text className={styles.description}>
              <Highlight
                text={entry.description}
                query={query}
              />
            </Text>
          </li>
        ))}
      </ul>
    </Flex>
  );
};
