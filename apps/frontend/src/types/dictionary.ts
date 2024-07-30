type WithoutUndefinedProperties<T extends object> = {
  [P in keyof T as T[P] extends undefined ? never : P]: T[P];
};

type PartialBooleanProperties<T extends object> = {
  [K in keyof Partial<T>]: boolean;
};

type PartialProperties<
  T extends object,
  U extends PartialBooleanProperties<T>,
> = WithoutUndefinedProperties<{
  [key in keyof T]: U[key] extends true ? T[key] : undefined;
}>;

type FilteredColumnsByArray<T extends object, U extends (keyof T)[]> = {
  [K in U[number]]: T[K];
};

export type {
  PartialProperties,
  PartialBooleanProperties,
  FilteredColumnsByArray,
};
