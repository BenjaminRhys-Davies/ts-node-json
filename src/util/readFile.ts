import { readFile as fsReadFile } from "graceful-fs";
import { promisify } from "util";
import { encoding } from "../config/encoding";

const readFilePromised = promisify(fsReadFile);

export const readFile = (path: string): Promise<string> =>
  readFilePromised(path, { encoding });
