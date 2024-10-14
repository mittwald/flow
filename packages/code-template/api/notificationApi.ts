export interface Notification {
  title: string;
  date: string;
  href: string;
}

export const notifications: Notification[] = [
  {
    title: "Speicherplatz fast voll",
    date: "13.09.2024, 07:15 Uhr",
    href: "/project/emails",
  },
  {
    title: "Projekt erfolgreich angelegt",
    date: "01.09.2024, 15:52 Uhr",
    href: "/project",
  },
  {
    title: "Organisation erfolgreich angelegt",
    date: "30.08.2024, 12:28 Uhr",
    href: "/customer",
  },
];

export const listNotifications = (): Notification[] => {
  return notifications;
};
