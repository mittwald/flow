export interface User {
  id: string;
  name: string;
  email: string;
}

export const users: User[] = [
  { id: "1", name: "Franz Müller", email: "f.mueller@mittwald.de" },
  { id: "2", name: "Anna Schmidt", email: "a.schmidt@mittwald.de" },
  { id: "3", name: "John Doe", email: "john@doe.de" },
  { id: "4", name: "Max Mustermann", email: "max@mustermann.de" },
  { id: "4", name: "Martina Mustermann", email: "martina@mustermann.de" },
];

export const listUsers = (): User[] => {
  return users;
};

export const getUser = (id: string): User => {
  const user = users.find((d) => d.id === id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
