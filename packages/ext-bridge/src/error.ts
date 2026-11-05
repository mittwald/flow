export class ExtBridgeError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.message = message;
  }
}

ExtBridgeError.prototype.name = "ExtBridgeError";
