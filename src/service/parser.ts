export type Handler<T> = (content: string) => undefined | T;

type Handlers<T> = {
  [extension: string]: Handler<T>;
};

const state: Handlers<unknown> = {};

export const register = <T>(extension: string, handler: Handler<T>): void => {
  state[extension.toLowerCase()] = handler;
};

export const parse = <T>(extension: string, content: string): undefined | T => {
  const handler = state[extension.toLowerCase()];
  return handler ?
    handler(content) as T :
    undefined;
};

export type Register = Parameters<typeof register>;
