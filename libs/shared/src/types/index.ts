// export type PartialPromise<T> = T>>;

export type ApiPromise<T> = Promise<
  Partial<T & { message: string; error: any }>
>;
