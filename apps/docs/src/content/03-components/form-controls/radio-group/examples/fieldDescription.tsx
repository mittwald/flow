import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { FieldDescription } from "@mittwald/flow-react-components/FieldDescription";

<RadioGroup defaultValue="more">
  <Heading level={4}>
    Wie viele Pflanzen besitzt du?
  </Heading>
  <Radio value="more">Mehr als 9 Pflanzen</Radio>
  <Radio value="6-8">6-8 Pflanzen</Radio>
  <Radio value="3-5">3-5 9 Pflanzen</Radio>
  <Radio value="1-2">1-2 Pflanzen</Radio>
  <Radio value="none">Keine</Radio>
  <FieldDescription>
    Mehrere identische Pflanzen in einem Topf gelten als
    eine Pflanze.
  </FieldDescription>
</RadioGroup>;
