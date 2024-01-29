export interface Property {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description?: string | null;
}

export interface PropertyGroup {
  name: string;
  properties: Property[];
}
