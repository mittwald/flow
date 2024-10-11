export interface Project {
  id: string;
  shortId: string;
  name: string;
  server: string;
  domain: string;
  createdAt: string;
  aRecord: string;
}

export const project: Project = {
  id: "1",
  shortId: "p-lis5uw",
  name: "Mein Projekt",
  server: "Mein Server",
  domain: "https://p-lis5uw.project.space",
  createdAt: "06.12.2023 um 11:40 Uhr",
  aRecord: "45.225.312.55",
};

export const getProject = (): Project => {
  return project;
};
