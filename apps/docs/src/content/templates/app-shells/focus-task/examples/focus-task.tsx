import {
  Button,
  Heading,
  Label,
  LayoutCard,
  Link,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import styles from "./focus-task.module.css";

export default () => (
  <div className={styles.page}>
    <main className={styles.center}>
      <span
        className={styles.logo}
        role="img"
        aria-label="mittwald"
      />
      <LayoutCard>
        <div className={styles.card}>
          <Heading level={2}>Login</Heading>
          <TextField type="email" isRequired>
            <Label>E-Mail-Adresse</Label>
          </TextField>
          <TextField type="password" isRequired>
            <Label>Passwort</Label>
          </TextField>
          <div className={styles.actions}>
            <Link href="#">Passwort vergessen</Link>
            <Button>Anmelden</Button>
          </div>
          <Text className={styles.registerLine}>
            Du hast noch keinen Nutzer?{" "}
            <Link href="#">Registrieren</Link>
          </Text>
        </div>
      </LayoutCard>
      <div className={styles.footer}>
        <Link href="#" target="_blank" color="dark">
          Datenschutz
        </Link>
        <Link href="#" target="_blank" color="dark">
          Impressum
        </Link>
      </div>
    </main>
  </div>
);
