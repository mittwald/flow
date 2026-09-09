import {
  Avatar,
  ContextMenu,
  Heading,
  IconDelete,
  IconEdit,
  IconInfo,
  IconSubdomain,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const ActivityList = typedList<{
    id: string;
    action: "created" | "changed" | "deleted";
    title: string;
    object: string;
    when: string;
    who: string;
  }>();

  const icon = {
    created: <IconSubdomain />,
    changed: <IconEdit />,
    deleted: <IconDelete />,
  };

  const color = {
    created: "green",
    changed: "blue",
    deleted: "violet",
  } as const;

  return (
    <ActivityList.List
      aria-label="Aktivitäten"
      getItemId={(activity) => activity.id}
      hidePagination
    >
      <ActivityList.Filter name="Typ" property="action" />
      <ActivityList.StaticData
        data={[
          {
            id: "1",
            action: "deleted",
            title: "Domain",
            object: "www.iliketomoveit.de",
            when: "10.08.2026 um 11:09 Uhr",
            who: "Felix Fritzsche",
          },
          {
            id: "2",
            action: "changed",
            title:
              "Durch mittwald verwalteter A-Record für",
            object: "test.iliketomoveit.de",
            when: "10.08.2026 um 11:07 Uhr",
            who: "Automatisch",
          },
          {
            id: "3",
            action: "created",
            title: "DNS-Zone",
            object: "test.iliketomoveit.de",
            when: "10.08.2026 um 11:07 Uhr",
            who: "Automatisch",
          },
        ]}
      />
      <ActivityList.Item
        textValue={(activity) =>
          `${activity.title} ${activity.object}`
        }
      >
        {(activity) => (
          <ActivityList.ItemView>
            <Avatar color={color[activity.action]}>
              {icon[activity.action]}
            </Avatar>
            <Heading>
              {activity.title} <b>{activity.object}</b>{" "}
              {activity.action === "deleted"
                ? "gelöscht"
                : activity.action === "created"
                  ? "angelegt"
                  : "gesetzt"}
            </Heading>
            <Text>
              {activity.when} – {activity.who}
            </Text>
            <ContextMenu>
              <MenuItem>
                <IconInfo />
                <Text>Details anzeigen</Text>
              </MenuItem>
            </ContextMenu>
          </ActivityList.ItemView>
        )}
      </ActivityList.Item>
    </ActivityList.List>
  );
};
