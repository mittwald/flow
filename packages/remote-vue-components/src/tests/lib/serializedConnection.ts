/*
 * The React package's serializing connection, which its visual suite's
 * `Remote` environment runs on — reused rather than copied, so the three
 * places that route a remote tree through `FlowThreadSerialization` over a
 * MessageChannel (that suite, this package's tests, the parity harnesses)
 * cannot drift apart.
 *
 * A relative path into the React package, the way the parity harnesses reach
 * for its `RootContainer`: the file is test tooling and no package entry
 * exports it.
 */
export {
  createSerializedConnection,
  createSerializedReceiver,
} from "../../../../remote-react-components/src/tests/lib/serializedConnection";
