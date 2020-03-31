import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { parseDate } from "../Common/dates";
import { Filetype } from "../Common/types";
import fetch from "node-fetch";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const date = parseDate(req.query.date);
  const sixJsonBaseUrl = process.env.SIX_JSON_BASE_URL;
  const integrateUrl = process.env.SIX_INTEGRATE_URL;

  if (!date) {
    context.res = {
      status: 400,
      body: 'Missing required query param "date" (yyyy-mm-dd)'
    };
    return;
  }
  if (!sixJsonBaseUrl) {
    context.res = {
      status: 500,
      body: "Missing app setting SIX_JSON_BASE_URL"
    };
    return;
  }
  if (!integrateUrl) {
    context.res = {
      status: 500,
      body: "Missing app setting SIX_INTEGRATE_URL"
    };
    return;
  }
  const dateString = date.toISOString().substr(0, 10);

  const smcapUrl = `${sixJsonBaseUrl}&date=${dateString}&filetype=${"smcap" as Filetype}`;
  const smcapResponse = await fetch(smcapUrl);
  const smcap = await smcapResponse.json();

  const bluechipsUrl = `${sixJsonBaseUrl}&date=${dateString}&filetype=${"bluechips" as Filetype}`;
  const bluechipsResponse = await fetch(bluechipsUrl);
  const bluechips = await bluechipsResponse.json();

  const combined = [...smcap, ...bluechips];

  await fetch(integrateUrl, {
    method: "POST",
    body: JSON.stringify(combined)
  });

  context.res = {
    status: 200
  };
};

export default httpTrigger;
