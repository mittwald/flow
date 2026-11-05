export const publicKeySerialPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isValidPublicKeySerial = (serial: string): boolean =>
  publicKeySerialPattern.test(serial);
