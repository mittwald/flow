export interface Email {
  email: string;
  storage: number;
}

export const emails: Email[] = [
  { email: "john@doe.de", storage: 80 },
  { email: "info@doe.de", storage: 7 },
  { email: "max@mustermann.de", storage: 20 },
  { email: "kontakt@mustermann.de", storage: 24 },
];

export const listEmails = (): Email[] => {
  return emails;
};
