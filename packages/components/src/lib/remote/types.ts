export type FieldProps<T, P> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T, ...args: never[]) => void;
} & P;
