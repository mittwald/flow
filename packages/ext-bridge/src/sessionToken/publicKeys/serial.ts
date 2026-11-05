export const publicKeySerialPattern = /^[A-Za-z0-9._-]{1,128}$/;

export const isValidPublicKeySerial = (serial: string): boolean =>
  publicKeySerialPattern.test(serial);
