interface EventDetails {
  type: string;
  [k: string]: unknown;
}

export const dispatchEvent = (eventDetails: EventDetails) => {
  const { type, ...rest } = eventDetails;
  const event = new Event(type);
  Object.assign(event, rest);
  return event;
};
