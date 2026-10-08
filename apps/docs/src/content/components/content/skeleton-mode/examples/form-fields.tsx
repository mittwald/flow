import {
  Checkbox,
  ColumnLayout,
  FieldDescription,
  Label,
  Option,
  Section,
  Select,
  SkeletonMode,
  Slider,
  Switch,
  TextField,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Section>
      <Switch
        isSelected={isLoading}
        onChange={setIsLoading}
      >
        Ladezustand anzeigen
      </Switch>
      <SkeletonMode isEnabled={isLoading}>
        <Section>
          <ColumnLayout m={[1, 1]}>
            <TextField defaultValue="wordpress_prod">
              <Label>Datenbankname</Label>
              <FieldDescription>
                Nur Kleinbuchstaben und Unterstriche
              </FieldDescription>
            </TextField>
            <Select defaultValue="8.4">
              <Label>MySQL-Version</Label>
              <Option value="8.0">8.0</Option>
              <Option value="8.4">8.4</Option>
            </Select>
          </ColumnLayout>
          <Slider
            defaultValue={20}
            minValue={5}
            maxValue={100}
          >
            <Label>Speicherplatz in GB</Label>
          </Slider>
          <Checkbox defaultSelected>
            Tägliches Backup
          </Checkbox>
          <Switch defaultSelected>
            Fernzugriff erlauben
          </Switch>
        </Section>
      </SkeletonMode>
    </Section>
  );
};
