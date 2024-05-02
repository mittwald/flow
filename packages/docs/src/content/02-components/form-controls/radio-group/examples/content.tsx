import RadioGroup, {
  RadioButton,
} from "@mittwald/flow-react-components/RadioGroup";
import Text from "@mittwald/flow-react-components/Text";
import Content from "@mittwald/flow-react-components/Content";

<RadioGroup defaultValue="domain" aria-label="Domain">
  <RadioButton value="domain">
    <Text>Domain buchen</Text>
    <Content>
      Du hast eine Wunsch-Domain? Kein Problem wir helfen
      dir die passende Domain für dich zu finden.
    </Content>
  </RadioButton>
  <RadioButton value="virtualHost">
    <Text>Virtual Host einrichten</Text>
    <Content>
      TDie Domain bleibt bei deinem bisherigen Anbieter, du
      kannst sie aber für deine Website in unserem mStudio
      verwenden.
    </Content>
  </RadioButton>
  <RadioButton value="subdomain">
    <Text>Subdomain anlegen</Text>
    <Content>
      Eine Subdomain von einer bereits vorhandenen Domain
      erstellen, um sie für dein Projekt zu verwenden.
    </Content>
  </RadioButton>
</RadioGroup>;
