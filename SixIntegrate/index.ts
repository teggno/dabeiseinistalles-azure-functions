import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Stock, SixContents } from "../Common/types";
import { arrayToMap } from "../Common/util";

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  try {
    const toBeIntegrated = req.body as SixContents;
    const existingPrices = context.bindings.pricesJsonIn as PricesJsonV2;
    const existingGrouped = arrayToMap(existingPrices.prices, getKey);
    toBeIntegrated.prices.forEach(tbi => {
      const key = getKey(tbi);
      existingGrouped[key] = tbi;
    });
    context.bindings.pricesJsonOut = {
      prices: Object.values(existingGrouped),
      latestIntegratedFileProducedAt:
        toBeIntegrated.producedAt >
        existingPrices.latestIntegratedFileProducedAt
          ? toBeIntegrated.producedAt
          : existingPrices.latestIntegratedFileProducedAt
    };

    context.res = {
      status: 200
    };
  } catch (e) {
    context.log("error parsing data", e);
    context.res = {
      status: 400,
      body: `Request body must be valid JSON ${e}`
    };
  }
};

export default httpTrigger;

function getKey(stock: Stock) {
  return `${stock.valorSymbol}${stock.lastDate}`;
}

interface PricesJsonV2 {
  prices: Stock[];
  latestIntegratedFileProducedAt: string;
}
