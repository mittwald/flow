export interface Property {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description?: string | null;
  deprecated: boolean;
}

export type PropertyCategories = "events" | "accessibility" | "other";

export type Properties = {
  [key in PropertyCategories]: Property[];
};
