import { now } from "../util/date";
import { close, init, log } from "../util/writeStream";

const logFile = "diagnostics.log";

const state = {
  start: now(),
  stream: init(logFile),
};

export const info = (line: string): boolean => log(state.stream, `[${now().toISOString()}] ${line}`);

export const error = (e: Error): boolean => info(`Error: ${JSON.stringify(e)}`);

export const stop = (): void => {
  const duration = now().valueOf() - state.start.valueOf();

  info(`…finished in ${duration}ms\n`);
  close(state.stream);
}

info("Starting…");
