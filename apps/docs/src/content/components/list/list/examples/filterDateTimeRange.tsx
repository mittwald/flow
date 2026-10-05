import { typedList } from "@mittwald/flow-react-components";
import {
  getLocalTimeZone,
  now,
  today,
} from "@internationalized/date";

export default () => {
  const CronjobRunList = typedList<{
    id: string;
    cronjob: string;
    startedAt: string;
  }>();

  const currentTime = now(getLocalTimeZone()).set({
    second: 0,
    millisecond: 0,
  });

  return (
    <CronjobRunList.List
      aria-label="Cronjob-Ausführungen"
      defaultViewMode="table"
      getItemId={(run) => run.id}
    >
      <CronjobRunList.StaticData
        data={[
          {
            id: "1",
            cronjob: "Datenbank-Backup",
            startedAt: currentTime
              .subtract({ minutes: 20 })
              .toAbsoluteString(),
          },
          {
            id: "2",
            cronjob: "Cache leeren",
            startedAt: currentTime
              .subtract({ hours: 3 })
              .toAbsoluteString(),
          },
          {
            id: "3",
            cronjob: "Sitemap erzeugen",
            startedAt: currentTime
              .subtract({ hours: 9 })
              .toAbsoluteString(),
          },
          {
            id: "4",
            cronjob: "Datenbank-Backup",
            startedAt: currentTime
              .subtract({ days: 1 })
              .toAbsoluteString(),
          },
        ]}
      />
      <CronjobRunList.Filter
        property="startedAt"
        mode="dateRange"
        name="Zeitraum"
        dateRangeOptions={{
          granularity: "minute",
          maxValue: today(getLocalTimeZone()),
        }}
      />
      <CronjobRunList.Table>
        <CronjobRunList.TableHeader>
          <CronjobRunList.TableColumn>
            Cronjob
          </CronjobRunList.TableColumn>
          <CronjobRunList.TableColumn>
            Gestartet
          </CronjobRunList.TableColumn>
        </CronjobRunList.TableHeader>

        <CronjobRunList.TableBody>
          <CronjobRunList.TableRow>
            <CronjobRunList.TableCell>
              {(run) => run.cronjob}
            </CronjobRunList.TableCell>
            <CronjobRunList.TableCell>
              {(run) =>
                new Date(run.startedAt).toLocaleString(
                  "de-DE",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  },
                )
              }
            </CronjobRunList.TableCell>
          </CronjobRunList.TableRow>
        </CronjobRunList.TableBody>
      </CronjobRunList.Table>
    </CronjobRunList.List>
  );
};
