import {
  Badge,
  Button,
  ColumnLayout,
  Content,
  Flex,
  Heading,
  Label,
  LayoutCard,
  Link,
  RadioButton,
  RadioGroup,
  Section,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableFooterRow,
  TableHeader,
  TableRow,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import { MittwaldLogo } from "../../MittwaldLogo";
import styles from "./focus-task-bestellung.module.css";

export default () => (
  <Flex justify="center" className={styles.page}>
    <Flex
      elementType="main"
      direction="column"
      align="stretch"
      gap="l"
      className={styles.center}
    >
      <MittwaldLogo className={styles.logo} />
      <Heading level={1}>Bestellung</Heading>

      <ColumnLayout l={[2, 1]}>
        <LayoutCard>
          <Section>
            <Heading>Individuell konfigurieren</Heading>
            <Text>
              Passe deinen Tarif ganz einfach an deine
              Bedürfnisse an. Wähle Ressourcen und
              Speicherplatz so, wie du sie wirklich
              brauchst, und stelle dir deinen passenden
              Tarif zusammen.
            </Text>

            <Heading level={3}>Ressourcen</Heading>
            <Text>
              Die Ressourcen aus vCPU und RAM bestimmen die
              Leistung deines Tarifs. Du kannst sie
              jederzeit nach der Buchung anpassen.
            </Text>
            <RadioGroup
              defaultValue="rec"
              aria-label="Ressourcen"
              l={[1, 1, 1]}
            >
              <RadioButton value="small">
                <Text>1 vCPU</Text>
                <Content>1 GiB RAM</Content>
              </RadioButton>
              <RadioButton value="rec">
                <Flex
                  align="center"
                  gap="s"
                  className={styles.resourceTitle}
                >
                  <Text>1 vCPU</Text>
                  <Badge color="blue">Empfehlung</Badge>
                </Flex>
                <Content>2 GiB RAM</Content>
              </RadioButton>
              <RadioButton value="large">
                <Text>2 vCPU</Text>
                <Content>4 GiB RAM</Content>
              </RadioButton>
            </RadioGroup>

            <Heading level={3}>Speicherplatz</Heading>
            <Text>
              Der Speicherplatz umfasst Datenbanken,
              Backups, Webspace und E-Mails aller Projekte
              auf deinem Tarif.
            </Text>
            <RadioGroup
              defaultValue="40"
              aria-label="Speicherplatz"
              l={[1, 1, 1]}
            >
              <RadioButton value="20">20 GiB</RadioButton>
              <RadioButton value="40">40 GiB</RadioButton>
              <RadioButton value="60">60 GiB</RadioButton>
              <RadioButton value="80">80 GiB</RadioButton>
              <RadioButton value="100">100 GiB</RadioButton>
              <RadioButton value="custom">
                Individuell
              </RadioButton>
            </RadioGroup>

            <Flex
              align="center"
              justify="space-between"
              wrap="wrap"
              gap="m"
            >
              <Button variant="soft" color="secondary">
                Abbrechen
              </Button>
              <Flex
                wrap="wrap"
                gap="m"
                className={styles.actionsRight}
              >
                <Button variant="soft" color="secondary">
                  Zurück
                </Button>
                <Button>Weiter</Button>
              </Flex>
            </Flex>
          </Section>
        </LayoutCard>

        <LayoutCard>
          <Section>
            <Heading>Kostenübersicht</Heading>
            <Table aria-label="Kostenübersicht">
              <TableHeader>
                <TableColumn>Artikel</TableColumn>
                <TableColumn horizontalAlign="end">
                  Monatliche Kosten
                </TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1 vCPU / 2 GiB RAM</TableCell>
                  <TableCell horizontalAlign="end">
                    17,00 €
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>40 GiB Speicher</TableCell>
                  <TableCell horizontalAlign="end">
                    2,00 €
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Aktionsrabatt</TableCell>
                  <TableCell horizontalAlign="end">
                    -5,00 €
                  </TableCell>
                </TableRow>
                <TableFooterRow>
                  <TableCell>Gesamt</TableCell>
                  <TableCell horizontalAlign="end">
                    14,00 €
                  </TableCell>
                </TableFooterRow>
              </TableBody>
            </Table>

            <Flex align="end" gap="m">
              <TextField>
                <Label>Gutscheincode</Label>
              </TextField>
              <Button variant="soft" color="secondary">
                Einlösen
              </Button>
            </Flex>
          </Section>
        </LayoutCard>
      </ColumnLayout>

      <Flex justify="center" wrap="wrap" gap="l">
        <Link href="#" target="_blank" color="dark">
          Datenschutz
        </Link>
        <Link href="#" target="_blank" color="dark">
          Impressum
        </Link>
      </Flex>
    </Flex>
  </Flex>
);
