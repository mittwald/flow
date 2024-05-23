export const sleep = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));
