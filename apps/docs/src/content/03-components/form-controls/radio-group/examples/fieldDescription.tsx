import {
  FieldDescription,
  Label,
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components";

<RadioGroup defaultValue="more">
  <Label>Wie viele Pflanzen besitzt du?</Label>
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
