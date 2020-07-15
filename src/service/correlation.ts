import { FileAnswer } from "../command/query";

type Criterion = {
  name: string;
  predicate: (answer: FileAnswer[]) => any;
};

type Correlation = {
  data: ReturnType<Criterion["predicate"]>;
  name: string;
};

const state: Criterion[] = [];

export const register = (name: Criterion["name"], predicate: Criterion["predicate"]): number =>
  state.push({ name, predicate });

export const correlate = (fileAnswers: FileAnswer[]): Correlation[] => state.map(({ name, predicate }) => ({ name, data: predicate(fileAnswers) }));

export type Register = Parameters<typeof register>;
