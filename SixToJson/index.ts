import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as six from "./six";
import { parseDate } from "../Common/dates";
import { Filetype } from "../Common/types";
const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const date = parseDate(req.query.date); // yyyy-mm-dd
  const filetype = parseFileType(req.query.filetype); // "smcap" | "bluechips"
  if (date && filetype) {
    try {
      const json = await getJson(filetype, date);
      if (!json) {
        context.res = {
          status: 404,
          body: `Apparently no file found (${filetype}, ${date
            .toISOString()
            .substr(0, 10)}).`
        };
        return;
      }
      context.res = {
        body: json,
        headers: { "Content-Type": "application/json" }
      };
    } catch (e) {
      context.res = {
        status: 400,
        body: `Failed converting SIX json (${filetype}, ${date
          .toISOString()
          .substr(0, 10)}). Error: ${e}`
      };
    }
  } else {
    context.res = {
      status: 400,
      body:
        'Missing one or both of required query params "date" (yyyy-mm-dd) and "filetype" ("smcap" | "bluechips")'
    };
  }
};

export default httpTrigger;

function getJson(filetype: Filetype, date: Date) {
  return filetype === "bluechips"
    ? six.getBlueChips(date)
    : six.getMidAndSmallCaps(date);
}

function parseFileType(filetype: string): Filetype | null {
  return filetype === "smcap"
    ? "smcap"
    : filetype === "bluechips"
    ? "bluechips"
    : null;
}
