import {
  Button,
  Flex,
  Heading,
  Label,
  LayoutCard,
  Link,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import styles from "./focus-task.module.css";

export default () => (
  <Flex
    justify="center"
    align="center"
    className={styles.page}
  >
    <Flex
      elementType="main"
      direction="column"
      align="stretch"
      gap="l"
      className={styles.center}
    >
      <span
        className={styles.logo}
        role="img"
        aria-label="mittwald"
      />
      <LayoutCard>
        <Section>
          <Heading>Login</Heading>
          <TextField type="email" isRequired>
            <Label>E-Mail-Adresse</Label>
          </TextField>
          <TextField type="password" isRequired>
            <Label>Passwort</Label>
          </TextField>
          <Flex
            align="center"
            justify="space-between"
            wrap="wrap"
            gap="m"
          >
            <Link href="#">Passwort vergessen</Link>
            <Button>Anmelden</Button>
          </Flex>
          <Text className={styles.registerLine}>
            Du hast noch keinen Nutzer?{" "}
            <Link href="#">Registrieren</Link>
          </Text>
        </Section>
      </LayoutCard>
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
