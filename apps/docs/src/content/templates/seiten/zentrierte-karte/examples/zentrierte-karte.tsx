import {
  ActionGroup,
  Flex,
  Heading,
  Label,
  LayoutCard,
  Link,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default () => {
  const form = useForm<{ email: string; password: string }>(
    {
      defaultValues: { email: "", password: "" },
    },
  );

  const Field = typedField(form);

  return (
    <Flex direction="column" align="center" gap="l">
      <Flex direction="column" align="center">
        <Heading level={1} size="l" color="dark">
          mittwald.
        </Heading>
        <Text color="dark">mStudio</Text>
      </Flex>

      {/* Flow hat keinen breitenbegrenzten zentrierten Container –
          die Breite ist die eine Stelle, die dieses Template selbst setzt. */}
      <div style={{ width: "100%", maxWidth: 520 }}>
        <LayoutCard>
          <Form form={form} onSubmit={() => undefined}>
            <Section>
              <Heading>Login</Heading>

              <Field
                name="email"
                rules={{
                  required:
                    "Bitte gib deine E-Mail-Adresse ein",
                }}
              >
                <TextField
                  type="email"
                  autoComplete="username"
                >
                  <Label>E-Mail-Adresse</Label>
                </TextField>
              </Field>

              <Field
                name="password"
                rules={{
                  required: "Bitte gib dein Passwort ein",
                }}
              >
                <TextField
                  type="password"
                  autoComplete="current-password"
                >
                  <Label>Passwort</Label>
                </TextField>
              </Field>

              <ActionGroup>
                <SubmitButton>Anmelden</SubmitButton>
                <Link slot="abort" href="#">
                  Passwort vergessen
                </Link>
              </ActionGroup>

              <Text>
                Du hast noch keinen Nutzer?{" "}
                <Link href="#">Registrieren</Link>
              </Text>
            </Section>
          </Form>
        </LayoutCard>
      </div>

      <Flex
        direction="row"
        gap="m"
        wrap="wrap"
        justify="center"
      >
        <Link href="#" target="_blank">
          Webmail
        </Link>
        <Link href="#" target="_blank">
          Kundencenter
        </Link>
        <Link href="#" target="_blank">
          Datenschutz
        </Link>
        <Link href="#" target="_blank">
          Impressum
        </Link>
      </Flex>
    </Flex>
  );
};
