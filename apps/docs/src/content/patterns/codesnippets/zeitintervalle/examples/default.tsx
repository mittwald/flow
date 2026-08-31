import {
  Content,
  FieldError,
  Label,
  LabeledValue,
  Option,
  Section,
  Select,
  type SelectProps,
  Separator,
  Text,
  TextField,
  TimeField,
  type TimeFieldProps,
} from "@mittwald/flow-react-components";
import CronTime from "cron-time-generator";
import { type FC, useMemo, useState } from "react";
import {
  CronExpressionParser,
  CronFieldCollection,
  type HourRange,
  type SixtyRange,
} from "cron-parser";

export default () => {
  type Interval =
    | "ONE_MINUTE"
    | "FIVE_MINUTES"
    | "THIRTY_MINUTES"
    | "ONE_HOUR"
    | "ONE_DAY"
    | "SEVEN_DAYS"
    | "FOURTEEN_DAYS"
    | "THIRTY_DAYS"
    | "CUSTOM";

  const Intervals: Record<
    Interval,
    {
      label: string;
      toCronString: (lastCronString: string) => string;
      allowTimeEdit?: boolean;
      allowCustomEdit?: boolean;
    }
  > = {
    ONE_MINUTE: {
      label: "1 Minute",
      toCronString: () => CronTime.everyMinute(),
    },
    FIVE_MINUTES: {
      label: "5 Minuten",
      toCronString: () => CronTime.every(5).minutes(),
    },
    THIRTY_MINUTES: {
      label: "30 Minuten",
      toCronString: () => CronTime.every(30).minutes(),
    },
    ONE_HOUR: {
      label: "1 Stunde",
      toCronString: () => CronTime.everyHour(),
    },
    ONE_DAY: {
      label: "1 Tag",
      toCronString: () => CronTime.everyDay(),
      allowTimeEdit: true,
    },
    SEVEN_DAYS: {
      label: "7 Tage",
      toCronString: () => CronTime.every(7).days(),
      allowTimeEdit: true,
    },
    FOURTEEN_DAYS: {
      label: "14 Tage",
      toCronString: () => CronTime.every(14).days(),
      allowTimeEdit: true,
    },
    THIRTY_DAYS: {
      label: "30 Tage",
      toCronString: () => CronTime.every(30).days(),
      allowTimeEdit: true,
    },
    CUSTOM: {
      label: "Benutzerdefiniert",
      allowCustomEdit: true,
      toCronString: (lastCronString) => lastCronString,
    },
  };

  const CronTimeSelector: FC<{
    value?: string;
    onChange: (cronValue: string) => void;
  }> = ({ value = "", onChange }) => {
    const [errorMessage, setErrorMessage] = useState<
      string | null
    >(null);
    const [currentInterval, setInterval] =
      useState<Interval>("CUSTOM");

    const parseCronExpression = (cron: string) => {
      try {
        const expression = CronExpressionParser.parse(cron);
        setErrorMessage(null);
        return expression;
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(`invalid cron: ${cron}`);
        }

        return false;
      }
    };

    const currentCronExpression = useMemo(
      () => parseCronExpression(value),
      [value],
    );

    const nextIntervals = useMemo(() => {
      if (!currentCronExpression) {
        return;
      }

      return currentCronExpression.take(5).map((time) => (
        <Text key={time.toISOString()}>
          {time.toString()}
          <br />
        </Text>
      ));
    }, [currentCronExpression]);

    const intervalSettings = Intervals[currentInterval];
    const isValidCronExpression =
      currentCronExpression && !errorMessage;

    const handleIntervalChange: SelectProps["onChange"] = (
      selectValue,
    ) => {
      const newInterval = selectValue as Interval | null;
      if (!newInterval) {
        return;
      }

      setInterval(newInterval);
      const intervalSettings = Intervals[newInterval];

      if (onChange) {
        onChange(intervalSettings.toCronString(value));
      }
    };

    const handleTimeChange: TimeFieldProps["onChange"] = (
      v,
    ) => {
      if (onChange && currentCronExpression) {
        const modified = CronFieldCollection.from(
          currentCronExpression.fields,
          {
            hour: [(v ? v.hour : 0) as HourRange],
            minute: [(v ? v.minute : 0) as SixtyRange],
          },
        );

        onChange(modified.stringify());
      }
    };

    const handleCustomCronChange = (customCron: string) => {
      const newExpression = parseCronExpression(customCron);
      if (newExpression && onChange) {
        onChange(customCron);
      }
    };

    return (
      <Section>
        <Select
          isRequired
          value={currentInterval}
          onChange={handleIntervalChange}
        >
          <Label>Interval</Label>
          {Object.keys(Intervals).map((i) => (
            <Option key={i} value={i}>
              {Intervals[i as Interval].label}
            </Option>
          ))}
        </Select>
        {intervalSettings.allowTimeEdit && (
          <TimeField onChange={handleTimeChange}>
            <Label>Uhrzeit</Label>
          </TimeField>
        )}
        {intervalSettings.allowCustomEdit && (
          <TextField
            isRequired
            isInvalid={!isValidCronExpression}
            value={value}
            onChange={handleCustomCronChange}
          >
            <Label>Cron-Syntax</Label>
            {errorMessage && (
              <FieldError>{errorMessage}</FieldError>
            )}
          </TextField>
        )}
        <Separator />
        <LabeledValue>
          <Label>Nächste Ausführungen</Label>
          <Content>
            {isValidCronExpression && nextIntervals}
          </Content>
        </LabeledValue>
      </Section>
    );
  };

  // only necessary because CronTimeSelector is an inline component
  // which is a requirement in the demo page
  const MemorizedCronTimeSelector = useMemo(
    () => CronTimeSelector,
    [],
  );

  const [currentCronString, setCronString] =
    useState("0 0 * * *");

  return (
    <>
      <MemorizedCronTimeSelector
        value={currentCronString}
        onChange={setCronString}
      />
    </>
  );
};
