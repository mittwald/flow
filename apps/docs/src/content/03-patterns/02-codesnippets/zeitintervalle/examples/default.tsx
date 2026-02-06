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
  Content,
} from "@mittwald/flow-react-components";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import {
  cronstrueToString,
  parse,
} from "@/content/03-patterns/02-codesnippets/zeitintervalle/examples/lib";

export default () => {
  enum Interval {
    ONE_MINUTE = "1 Minute",
    FIVE_MINUTES = "5 Minuten",
    THIRTY_MINUTES = "30 Minuten",
    ONE_HOUR = "1 Stunde",
    ONE_DAY = "1 Tag",
    SEVEN_DAYS = "7 Tage",
    FOURTEEN_DAYS = "14 Tage",
    THIRTY_DAYS = "30 Tage",
    CUSTOM = "Benutzerdefiniert",
  }

  const intervals = Object.values(Interval);
  const getCronString = (cronSyntax: string) => {
    try {
      /* convert cron to string with cronstrue */
      return cronstrueToString(cronSyntax);
    } catch (ignoredError) {
      return undefined;
    }
  };

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
      case Interval.ONE_MINUTE:
        return { cron: "* * * * *" };
      case Interval.FIVE_MINUTES:
        return { cron: "*/5 * * * *" };
      case Interval.THIRTY_MINUTES:
        return { cron: "*/30 * * * *" };
      case Interval.ONE_HOUR:
        return {
          cron: `${minute} * * * *`,
        };
      case Interval.ONE_DAY:
        return {
          cron: `${minute} ${hour} * * *`,
          time: newTime,
        };
      case Interval.SEVEN_DAYS:
        return {
          cron: `${minute} ${hour} * * ${weekday}`,
          time: newTime,
        };
      case Interval.FOURTEEN_DAYS:
        return {
          cron: `${minute} ${hour} 1,15 * *`,
          time: newTime,
        };
      case Interval.THIRTY_DAYS:
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

  const isValidCron = (cronSyntax: string) => {
    return !!getCronString(cronSyntax);
  };

  const getExecutions = (cron: string) => {
    if (!isValidCron(cron)) {
      return [
        "Ungültige Cron-Syntax",
        "Ungültige Cron-Syntax",
        "Ungültige Cron-Syntax",
      ];
    }

    try {
      /* parse cron with cron-parser */
      const interval = parse(cron);

      const executions: string[] = [];

      while (executions.length < 3) {
        executions.push(
          new Intl.DateTimeFormat("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(interval.next().toDate()) + " Uhr",
        );
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
      interval: Interval.CUSTOM,
    },
  });

  const Field = typedField(form);

  const [watchedCron, watchedTime, watchedInterval] =
    useWatch({
      control: form.control,
      name: ["cron", "time", "interval"],
    });

  const showTimeField =
    watchedInterval === Interval.ONE_MINUTE ||
    watchedInterval === Interval.SEVEN_DAYS ||
    watchedInterval === Interval.FOURTEEN_DAYS ||
    watchedInterval === Interval.THIRTY_DAYS;

  const showCronField = watchedInterval === Interval.CUSTOM;

  const executions = getExecutions(watchedCron);

  const nextExecutions = executions.map((date, i) => {
    return (
      <Text key={i}>
        {date}
        <br />
      </Text>
    );
  });

  const cronText = getCronString(watchedCron);

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
                    watchedInterval === Interval.CUSTOM
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
          <Content>{nextExecutions}</Content>
        </LabeledValue>
      </Section>
    </Form>
  );
};
