export class RemoteError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

RemoteError.prototype.name = "RemoteError";
