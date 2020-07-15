import ProgressBar from "progress";

const cyan = (str: string) => `\x1b[36m${str}\x1b[0m`;
const red = (str: string) => `\x1b[31m${str}\x1b[0m`;
const yellow = (str: string) => `\x1b[33m${str}\x1b[0m`;

const logo = `
    db    8b    d8 88""Yb 88   Yb  dP 888888 ${red("▶▷")}
   dPYb   88b  d88 88__dP 88    YbdP  88___  od
  dP  Yb  88YbdP88 88""'  88     88   88"""  88
 dP ${red("◥◤")} Yb 88 YY 88 88     888888 88   88     88
`;

const progressBarOptions = {
  complete: "■",
  incomplete: " ",
  width: 44,
};

export const code = (msg: string): void => info(`${cyan(msg)}\n`);

export const error = (msg: string): void => console.error(`${yellow(msg)}\n`);

export const info = console.info;

export const log = console.log;

export const progress = (total: number): ProgressBar => new ProgressBar(
  " [:bar]",
  {
    ...progressBarOptions,
    total,
  },
);

export const warning = console.warn;

export const welcome = (): void => log(logo);
