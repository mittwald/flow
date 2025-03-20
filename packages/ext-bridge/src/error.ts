export class ExtBridgeError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

ExtBridgeError.prototype.name = "ExtBridgeError";
