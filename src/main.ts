import { cat } from "./command/cat";
import { ls } from "./command/ls";
import { query } from "./command/query";
import { report } from "./command/report";
import * as display from "./util/display";
import * as diagnostic from "./service/diagnostic";
import { extension as jsonExtension } from "./setup/json";

const verbose = false;

const { argv: { 2: command, 3: path, 4: extension = jsonExtension }} = process;

display.welcome();

(async () => {
  if (command && path) {
    switch (command) {
      case "cat": {
        await cat(path);
        break;
      }
      case "ls": {
        await ls(path, { extension, verbose });
        break;
      }
      case "query": {
        await query(path, { extension, verbose });
        break;
      }
      case "report": {
        await report(path, { extension, filename: "report.json", verbose });
        break;
      }
      default: {
        display.warning("Unknown command");
      }
    }
  } else {
    display.warning("Command missing");
  }

  diagnostic.stop();
  display.log("\n");
})();
