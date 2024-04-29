interface Options {
  onSync?: () => void;
  onAsync?: () => void;
  then?: (result: unknown) => void;
  catch?: (error: unknown) => void;
  finally?: () => void;
}

export const callAndReact = (
  fn: (...args: unknown[]) => unknown,
  options: Options = {},
) => {
  const {
    onSync = () => {},
    onAsync = () => {},
    then = () => {},
    catch: $catch = () => {},
    finally: $finally = () => {},
  } = options;
  try {
    const result = fn();

    if (result instanceof Promise) {
      onAsync();
      return result.then(then).catch($catch).finally($finally);
    } else {
      onSync();
      then(result);
      $finally();
      return result;
    }
  } catch (error) {
    onSync();
    $catch(error);
    $finally();
  }
};
