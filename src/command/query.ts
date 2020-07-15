import { cat } from "./cat";
import { ls } from "./ls";
import { progress } from "../util/display";
import * as diagnostic from "../service/diagnostic";
import { parse } from "../service/parser";
import { question } from "../service/interrogation";
import { Document } from "../types/document";

interface Options {
  extension?: string;
  verbose?: boolean;
}

export type FileAnswer = [string, ReturnType<typeof question>];

export const query = async (
  path: string,
  {
    extension,
    verbose = false,
  }: Options = {}
): Promise<FileAnswer[]> => {
  const paths = await ls(path, { extension });

  if (paths.length) {
    const progressBar = progress(paths.length);

    return await Promise.all(paths.map(async (fileName): Promise<FileAnswer> => {
      const content = await cat(fileName);
      const document = parse<Document>(extension, content);
      const answer = question(document);

      if (verbose) {
        diagnostic.info(`<${fileName}> answered: ${JSON.stringify(answer)}`);
      }
      progressBar.tick();

      return [fileName, answer];
    }));
  }
  return [];
};
