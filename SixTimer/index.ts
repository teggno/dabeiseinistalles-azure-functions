import { AzureFunction, Context } from "@azure/functions";
import fetch from "node-fetch";

const timerTrigger: AzureFunction = async function(
  context: Context,
  myTimer: any
): Promise<void> {
  const sixMainBaseUrl = process.env.SIX_MAIN_BASE_URL;
  if (!sixMainBaseUrl) {
    context.log("Missing app setting SIX_MAIN_BASE_URL");
    return;
  }
  const date = new Date().toISOString().substr(0, 10);
  const sixMainUrl = `${sixMainBaseUrl}&date=${date}`;

  await fetch(sixMainUrl);

  context.log("Timer trigger function ran!", date);
};

export default timerTrigger;
