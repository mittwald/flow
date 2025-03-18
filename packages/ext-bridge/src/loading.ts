/** @internal */
export interface LoadingApi {
  ready: Promise<void>;
  _setIsReady: () => void;
}

let setIsReady: () => void = () => {
  throw new Error("Unexpected call of setIsReady()");
};

export const loadingApi: LoadingApi = {
  ready: new Promise<void>((res) => {
    setIsReady = res;
  }),
  _setIsReady: () => {
    setIsReady();
  },
};
