export interface SearchHeading {
  text: string;
  slug?: string;
}

export interface SearchIndexEntry {
  id: string;
  url: string;
  title: string;
  section: string;
  breadcrumb: string[];
  tab?: string;
  description?: string;
  headings: SearchHeading[];
  content: string;
}
