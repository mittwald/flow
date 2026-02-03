import { useForm, useWatch } from "react-hook-form";
import { Time } from "@internationalized/date";
import {
  ColumnLayout,
  FieldDescription,
  Label,
  LabeledValue,
  Option,
  Section,
  Select,
  Text,
  TextField,
  TimeField,
} from "@mittwald/flow-react-components";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import parser from "cron-parser";
import cronstrue from "cronstrue";
import "cronstrue/locales/de";

export default () => {
  type Interval =
    | "1m"
    | "5m"
    | "30m"
    | "1h"
    | "1d"
    | "7d"
    | "14d"
    | "30d"
    | "custom";

  const intervals: Interval[] = [
    "1m",
    "5m",
    "30m",
    "1h",
    "1d",
    "7d",
    "14d",
    "30d",
    "custom",
  ];

  const isDigitString = (value?: string) => {
    if (!value) {
      return false;
    }
    return /^\d+$/.test(value);
  };

  const getCronFromTime = (cron: string, time?: Time) => {
    if (!time) {
      return cron;
    }
    const cronParts = cron.split(" ");
    cronParts[1] = time.hour.toString();
    cronParts[0] = time.minute.toString();
    return cronParts.join(" ");
  };

  const getCronFromInterval = (
    cron: string,
    interval: Interval,
    time?: Time,
  ) => {
    const minuteOfTime =
      time && time.minute && !isNaN(time.minute)
        ? time.minute
        : undefined;
    const hourOfTime =
      time && time.hour && !isNaN(time.hour)
        ? time.hour
        : undefined;
    const cronParts = cron.split(" ");

    const minute = minuteOfTime
      ? minuteOfTime
      : cronParts[0] && isDigitString(cronParts[0])
        ? cronParts[0]
        : 0;
    const hour = hourOfTime
      ? hourOfTime
      : cronParts[1] && isDigitString(cronParts[1])
        ? cronParts[1]
        : 0;
    const day =
      cronParts[2] && isDigitString(cronParts[2])
        ? cronParts[2]
        : 1;
    const weekday =
      cronParts[4] && isDigitString(cronParts[4])
        ? cronParts[4]
        : 0;

    const newTime = new Time(
      typeof hour === "number" ? hour : parseInt(hour),
      typeof minute === "number"
        ? minute
        : parseInt(minute),
    );

    switch (interval) {
      case "1m":
        return { cron: "* * * * *" };
      case "5m":
        return { cron: "*/5 * * * *" };
      case "30m":
        return { cron: "*/30 * * * *" };
      case "1h":
        return {
          cron: `${minute} * * * *`,
        };
      case "1d":
        return {
          cron: `${minute} ${hour} * * *`,
          time: newTime,
        };
      case "7d":
        return {
          cron: `${minute} ${hour} * * ${weekday}`,
          time: newTime,
        };
      case "14d":
        return {
          cron: `${minute} ${hour} 1,15 * *`,
          time: newTime,
        };
      case "30d":
        return {
          cron: `${minute} ${hour} ${day} * *`,
          time: newTime,
        };

      default:
        return { cron };
    }
  };

  const getTimeFromCron = (cron: string) => {
    const cronParts = cron.split(" ");
    const minute =
      cronParts[0] && isDigitString(cronParts[0])
        ? cronParts[0]
        : undefined;
    const hour =
      cronParts[1] && isDigitString(cronParts[1])
        ? cronParts[1]
        : undefined;

    if (hour && minute) {
      return new Time(parseInt(hour), parseInt(minute));
    }
  };

  const getCronText = (cronSyntax: string) => {
    try {
      const cronText = cronstrue.toString(cronSyntax, {
        locale: "de",
        verbose: true,
      });

      return `${cronText} (UTC)`;
    } catch (ignoredError) {
      return undefined;
    }
  };

  const isValidCron = (cronSyntax: string) => {
    return !!getCronText(cronSyntax);
  };

  const getExecutions = (cron: string) => {
    if (!isValidCron(cron)) {
      return [];
    }

    try {
      const interval = parser.parse(cron);

      const executions: Date[] = [];

      while (executions.length < 3) {
        executions.push(interval.next().toDate());
      }

      return executions;
    } catch (ignoredError) {
      return [];
    }
  };

  const form = useForm<{
    cron: string;
    time: Time;
    interval: Interval;
    timeZone: string;
  }>({
    defaultValues: {
      cron: "0 * * * *",
      interval: "custom",
    },
  });

  const Field = typedField(form);

  const [watchedCron, watchedTime, watchedInterval] =
    useWatch({
      control: form.control,
      name: ["cron", "time", "interval"],
    });

  const showTimeField =
    watchedInterval === "1d" ||
    watchedInterval === "7d" ||
    watchedInterval === "14d" ||
    watchedInterval === "30d";

  const showCronField = watchedInterval === "custom";

  const executions = getExecutions(watchedCron);

  const nextExecutions = executions.map((date, i) => {
    return <span key={i}>{`${date} (UTC)`}</span>;
  });

  const cronText = getCronText(watchedCron);

  return (
    <Form form={form} onSubmit={(values) => alert(values)}>
      <Section>
        <Field
          name="interval"
          rules={{
            required: "Bitte wähle einen Interval aus",
          }}
        >
          <Select
            onChange={(v) => {
              const newValue = getCronFromInterval(
                watchedCron,
                v as Interval,
                showTimeField ? watchedTime : undefined,
              );
              form.setValue("cron", newValue.cron);
              if (newValue.time) {
                form.setValue("time", newValue.time);
              }
            }}
          >
            <Label>Interval</Label>
            {intervals.map((i) => (
              <Option key={i} value={i}>
                {i}
              </Option>
            ))}
          </Select>
        </Field>

        {showTimeField && (
          <ColumnLayout l={[1, 1]}>
            <Field
              name="time"
              rules={{
                required: "Bitte gib eine Uhrzeit ein",
              }}
            >
              <TimeField
                onChange={(v) => {
                  const newValue = getCronFromTime(
                    watchedCron,
                    v as Time,
                  );
                  form.setValue("cron", newValue);
                }}
              >
                <Label>Uhrzeit</Label>
              </TimeField>
            </Field>
          </ColumnLayout>
        )}

        {showCronField && (
          <ColumnLayout l={[1, 1]}>
            <Field
              name="cron"
              rules={{
                required: "Bitte gib eine Cron-Syntax ein",
                validate: {
                  invalidCron: (v) =>
                    isValidCron(v as string)
                      ? undefined
                      : "Ungültige Cron-Syntax",
                },
              }}
            >
              <TextField
                onChange={(v) => {
                  const newValue =
                    watchedInterval === "custom"
                      ? getTimeFromCron(v)
                      : undefined;
                  if (newValue) {
                    form.setValue("time", newValue);
                  }
                }}
              >
                <Label>Cron-Syntax</Label>
                <FieldDescription>
                  {cronText
                    ? cronText
                    : "Ungültige Cron-Syntax"}
                </FieldDescription>
              </TextField>
            </Field>
          </ColumnLayout>
        )}

        <LabeledValue>
          <Label>Nächste Ausführungen</Label>
          <Text>
            {nextExecutions && nextExecutions.length > 0 ? (
              nextExecutions
            ) : (
              <>
                {"Ungültige Cron-Syntax"}
                <br />
                {"Ungültige Cron-Syntax"}
                <br />
                {"Ungültige Cron-Syntax"}
              </>
            )}
          </Text>
        </LabeledValue>
      </Section>
    </Form>
  );
};
