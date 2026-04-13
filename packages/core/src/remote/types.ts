/**
 * Breaking Change warning: Do not remove/rename/modify existing properties of
 * this interface, as they might be used by existing extensions.
 *
 * When addding properties, make sure to release the host before all clients.
 */
export interface HostConfig {
  language: string;
}
