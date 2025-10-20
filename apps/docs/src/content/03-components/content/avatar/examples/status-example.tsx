import {
  AlertBadge,
  Avatar,
  Heading,
  IconEmail,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const NotificationList = typedList<{
    status: "info" | "success" | "danger" | "warning";
    content: string;
  }>();

  const EmailList = typedList<{
    address: string;
    blocked?: boolean;
  }>();

  return (
    <>
      <Section>
        <Heading>Benachrichtigungen</Heading>
        <Text>
          Hier wird der Status durch den Inhalt der
          Benachrichtigung erklärt, daher kann der Status
          Avatar verwendet werden.
        </Text>

        <NotificationList.List>
          <NotificationList.StaticData
            data={[
              {
                status: "danger",
                content:
                  'E-Mail-Adresse "mail@example.de" gesperrt',
              },
              {
                status: "success",
                content: "App erfolgreich angelegt",
              },
            ]}
          />
          <NotificationList.Item
            textValue={(notification) =>
              notification.content
            }
          >
            {(notification) => (
              <NotificationList.ItemView>
                <Avatar status={notification.status} />
                <Heading>{notification.content}</Heading>
              </NotificationList.ItemView>
            )}
          </NotificationList.Item>
        </NotificationList.List>
      </Section>
      <Section>
        <Heading>E-Mail-Adressen</Heading>
        <Text>
          Hier muss der Status durch das AlertBadge erklärt
          werden, der Status Avatar kann daher nicht
          verwendet werden.
        </Text>
        <EmailList.List>
          <EmailList.StaticData
            data={[
              {
                address: "mail@example.de",
                blocked: true,
              },
              {
                address: "info@example.de",
              },
            ]}
          />
          <EmailList.Item
            textValue={(email) => email.address}
          >
            {(email) => (
              <EmailList.ItemView>
                <Avatar>
                  <IconEmail />
                </Avatar>
                <Heading>
                  {email.address}
                  {email.blocked && (
                    <AlertBadge status="danger">
                      E-Mail-Adresse gesperrt
                    </AlertBadge>
                  )}
                </Heading>
              </EmailList.ItemView>
            )}
          </EmailList.Item>
        </EmailList.List>
      </Section>
    </>
  );
};
