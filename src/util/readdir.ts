import { Dirent, readdir as fsReaddir } from "graceful-fs";
import { extname, join } from "path";
import { promisify } from "util";
import { encoding } from "../config/encoding";

const readdirPromised = promisify(fsReaddir);

const isFile = (item: Dirent) => item.isFile();

const hasExtension = (extension?: string) =>
  ({ name }: Dirent) => !extension || extname(name).toLowerCase() === extension;

const getName = (path: string) =>
  ({ name }: Dirent) => join(path, name);

export const readdir = async (path: string, extension?: string): Promise<string[]> =>
  (await readdirPromised(path, { encoding, withFileTypes: true }))
    .filter(isFile)
    .filter(hasExtension(extension))
    .map(getName(path));
