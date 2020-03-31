import fetch from "node-fetch";
import log from "../Common/logger";
import { Stock, SixContents } from "../Common/types";

const blueChipsPrefix =
  "https://www.six-group.com/exchanges/data/market/statistics/swiss_blue_chip_shares_";
const smallMidPrefix =
  "https://www.six-group.com/exchanges/data/market/statistics/mid_and_small_caps_swiss_shares_";

export async function getMidAndSmallCaps(date: Date) {
  const url = buildUrl(smallMidPrefix, date);
  const csv = await downloadSixCsv(url);
  return parse(csv, parseLine);
}

export async function getBlueChips(date: Date) {
  const url = buildUrl(blueChipsPrefix, date);
  const csv = await downloadSixCsv(url);
  return parse(csv, parseLine);
}

function parseLine(line: string): Stock {
  const parts = line.split(";");

  return {
    shortName: parts[0],
    isin: parts[1],
    valorSymbol: parts[2],
    closingPrice: parseFloat(parts[4]),
    lastDate: parts[7]
  };
}

function buildUrl(prefix: string, date: Date) {
  const dateSuffix = date.toISOString().substr(0, 10);
  return `${prefix}${dateSuffix}.csv`;
}

async function downloadSixCsv(url: string) {
  try {
    log.debug("getting", url);
    const response = await fetch(url);
    const content = await response.text();
    log.debug("successfully got", url);
    return content;
  } catch (e) {
    log.error(`failed to GET ${url}`, e);
    throw e;
  }
}

function parse(csv: string, lineParser: (line: string) => Stock) {
  const result = {
    columnHeaders: null as string | null,
    prices: [] as Stock[],
    producedAt: null as string | null
  };
  csv.split("\n").forEach((line, i) => {
    if (i === 0) {
      result.columnHeaders = line;
    } else if (line.startsWith("Produced at:")) {
      result.producedAt = new Date(line.substr(13)).toISOString();
    } else {
      if (line.indexOf(";") !== -1) {
        result.prices.push(lineParser(line));
      }
    }
  });

  return result.columnHeaders && result.producedAt && result.prices.length > 0
    ? (result as SixContents)
    : null;
}
