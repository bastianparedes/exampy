interface Deferred<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: unknown) => void;
  promise: Promise<T>;
}

function getPromise<T = void>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { resolve, reject, promise };
}

export { getPromise };
