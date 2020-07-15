import { query } from "./query";
import { correlate } from "../service/correlation";
import * as diagnostic from "../service/diagnostic";
import { writeFile } from "../util/writeStream";

interface Options {
  extension?: string;
  filename: string;
  verbose?: boolean;
}

export const report = async (
  path: string,
  {
    extension,
    filename,
    verbose,
  }: Options
): Promise<ReturnType<typeof correlate>> => {
  const answers = await query(path, { extension });
  const reports = correlate(answers);

  if (verbose) {
    reports.forEach(({ data, name }) => diagnostic.info(`${name} report: ${JSON.stringify(data)}`));
  }
  writeFile(filename, reports);
  return reports;
};
