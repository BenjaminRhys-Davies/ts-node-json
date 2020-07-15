export type ComparableResult = any;

type Question<T> = {
  name: string;
  predicate: (doc?: T) => ComparableResult;
};

type Answer = {
  [name: string]: ComparableResult;
};

const state: Question<unknown>[] = [];

export const register = <T>(name: Question<T>["name"], predicate: Question<T>["predicate"]): number =>
  state.push({ name, predicate });

export const question = <T>(doc?: T): Answer => state.reduce(
  (answers: Answer, { name, predicate }) => ({ ...answers, [name]: predicate(doc) }),
  {},
);

export type Register = Parameters<typeof register>;
