interface Props<T> {
  data: T[];
}

export function ListStaticData<T = never>(ignoredProps: Props<T>) {
  return null;
}
