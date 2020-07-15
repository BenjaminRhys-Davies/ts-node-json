import { readdir } from "../util/readdir";
import * as diagnostic from "../service/diagnostic";

interface Options {
  extension?: string;
  verbose?: boolean;
}

export const ls = async (
  path: string,
  {
    extension,
    verbose,
  }: Options = {}
): ReturnType<typeof readdir> => {
  try {
    const filePaths = await readdir(path, extension);

    if (verbose) {
      diagnostic.info(`Found ${filePaths.length}${extension && ` '${extension}'` || ""} files`);
    }

    return filePaths;
  } catch (e) {
    diagnostic.error(e);
  }
};
