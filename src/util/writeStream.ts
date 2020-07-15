import { createWriteStream, WriteStream } from "graceful-fs";
import { encoding } from "../config/encoding";

const isWritableStream = (stream: WriteStream) => !!stream && stream.writable;

export const close = (stream: WriteStream): void => {
  if (isWritableStream(stream)) {
    stream.end();
  }
};

export const init = (fileName: string, flags: string = "a"): WriteStream =>
  createWriteStream(fileName, { encoding, flags });

export const log = (stream: WriteStream, line: string): boolean =>
  isWritableStream(stream) && stream.write(`${line}\n`);

export const writeFile = (fileName: string, content: object): void => {
  const fileStream = init(fileName, "w");
  log(fileStream, JSON.stringify(content, null, "\t"));
  close(fileStream);
};
