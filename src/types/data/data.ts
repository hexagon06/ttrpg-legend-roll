export declare type IdItem = {
  id?: string;
};
export declare type Reference = {
  id: string;
};
export type PathItem = {
  getPath: () => string;
};

export type Referenced<T> = Reference & T;
export type Id<T> = IdItem & T;
