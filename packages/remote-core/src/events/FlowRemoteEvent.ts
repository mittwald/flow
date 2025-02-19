export class FlowRemoteEvent<T> extends CustomEvent<T> {
  public constructor(type: string, detail: T) {
    super(type, {
      detail,
    });
  }
}
