import {
  RadioButton,
  RadioGroup,
} from "@mittwald/flow-react-components";

<RadioGroup
  defaultValue="selected"
  l={[1, 1]}
  aria-label="States"
>
  <RadioButton value="default">Domain buchen</RadioButton>
  <RadioButton value="selected">Domain buchen</RadioButton>
  <RadioButton isDisabled value="default">
    Domain buchen
  </RadioButton>
  <RadioButton isDisabled value="selected">
    Domain buchen
  </RadioButton>
</RadioGroup>;
