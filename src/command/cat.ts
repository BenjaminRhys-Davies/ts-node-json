import { readFile } from "../util/readFile";
import * as diagnostic from "../service/diagnostic";

export const cat = async (
  filePath: string,
): ReturnType<typeof readFile> => {
  try {
    return await readFile(filePath);
  } catch (e) {
    diagnostic.error(e);
  }
};
