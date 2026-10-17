import {
  Link,
  Section,
  Switch,
  Text,
  Wrap,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [isLinked, setIsLinked] = useState(true);

  return (
    <Section>
      <Switch isSelected={isLinked} onChange={setIsLinked}>
        Projekt verlinken
      </Switch>
      <Wrap if={isLinked}>
        <Link href="#">
          <Text>Webshop Relaunch</Text>
        </Link>
      </Wrap>
    </Section>
  );
};
