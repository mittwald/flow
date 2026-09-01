import {
  Content,
  RadioButton,
  RadioGroup,
  Text,
} from "@mittwald/flow-react-components";

<RadioGroup
  defaultValue="bookDomain"
  aria-label="Domain"
  l={[1, 1]}
>
  <RadioButton value="bookDomain">
    <Text>Domain buchen</Text>
    <Content>
      Du hast eine Wunsch-Domain? Kein Problem, wir helfen
      dir, die passende Domain für dich zu finden.
      <br />
      <strong>
        <small>8,28€ jährlich</small>
      </strong>
    </Content>
  </RadioButton>
  <RadioButton value="moveDomain">
    <Text>Domain umziehen</Text>
    <Content>
      Du hast schon eine Domain und möchtest sie von deinem
      jetzigen Anbieter zu mittwald umziehen.
      <br />
      <strong>
        <small>8,28€ jährlich</small>
      </strong>
    </Content>
  </RadioButton>
  <RadioButton value="virtualHost">
    <Text>Virtual Host einrichten</Text>
    <Content>
      Die Domain bleibt bei deinem bisherigen Anbieter, du
      kannst sie aber für deine Website in unserem mStudio
      verwenden.
      <br />
      <strong>
        <small>kostenlos</small>
      </strong>
    </Content>
  </RadioButton>
  <RadioButton value="subdomain">
    <Text>Subdomain anlegen</Text>
    <Content>
      Eine Subdomain von einer bereits vorhandenen Domain
      erstellen, um sie für dein Projekt zu verwenden.
      <br />
      <strong>
        <small>kostenlos</small>
      </strong>
    </Content>
  </RadioButton>
</RadioGroup>;
